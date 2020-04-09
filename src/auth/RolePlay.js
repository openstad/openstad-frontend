'use strict';

var http        = require('http');
var createError = require('http-errors');
var castArray   = require('lodash/castArray');
var defaults    = require('lodash/defaults');
var extend      = require('lodash/extend');
var forOwn      = require('lodash/forOwn');
var result      = require('lodash/result');
var zipObject   = require('lodash/zipObject');

// options = {
// 	defaultRoleName: string
// }
var RolePlay = module.exports = function RolePlay( options ) {
	this.options = options = defaults(options, {
		defaultError    : 'Not authorized',
		defaultRoleName : 'default'
	});
	
	this.roles       = {};
	this.defaultRole = new this.constructor.Role(this, options.defaultRoleName);
	this.roles[this.defaultRole.name] = this.defaultRole;
};
RolePlay.Role = Role;
RolePlay.Play = Play;

extend(RolePlay.prototype, {
	options     : undefined,
	defaultRole : undefined,
	roles       : undefined,
	
	// Express middleware
	// ------------------
	// Checks permission for the current user, and produces a 403 error when
	// access is denied. Passing multiple action is possible; by default only
	// the first action is required to be allowed for the request to succeed.
	// All consecutive actions are optional. Passing `true` as the last argument
	// makes all actions optional.
	// 
	// `req.user` must be set before this middleware runs. For permissions that
	// require a resource, `req.resource` must be set as well.
	// 
	// Adds `res.locals.can` as `function(actionName)` to check for the passed
	// permissions in template views.
	can: function( /* actionName [, actionName...] [, allOptional] */ ) {
		var self            = this;
		var actionNames_raw = Array.from(arguments);
		var lastArg         = actionNames_raw[actionNames_raw.length-1];
		var allOptional     = typeof lastArg === 'boolean' ?
		                      actionNames_raw.pop() :
		                      false;
		var actionNames     = this._getCanonicalActionNames(actionNames_raw);
		
		return function( req, res, next ) {
			if( !req.user ) {
				return next(createError(403, 'No authenticated user found'));
			}
			var user    = self.user(req.user);
			var allowed = actionNames.map(function( actionName ) {
				return user.can(actionName, req);
			});
			
			// Add `can(actionName)` function to locals, so the passed
			// permission can be checked in the template as well.
			var actions = zipObject(actionNames, allowed);
			self._addHelperFunction(req, res, actions);
			
			if( allOptional || allowed[0] ) {
				next();
			} else {
				var errorMessage = user.getErrorMessage(actionNames[0]);
				next(createError(403, errorMessage));
			}
		}
	},
	
	role: function( roleName ) {
		var role;
		if( roleName instanceof Role ) {
			role     = roleName;
			roleName = role.name;
		}
		
		if( this.roles[roleName] ) {
			if( role && this.roles[roleName] !== role ) {
				throw new Error('Duplicate role: '+roleName);
			}
			return this.roles[roleName];
		} else {
			if( !role ) {
				role = this.defaultRole.role(roleName);
			} else if( role.mgr != this ) {
				throw new Error('Role already in use');
			}
			return this.roles[roleName] = role;
		}
	},
	
	user: function( user ) {
		return new this.constructor.Play(this, user);
	},
	
	getAction: function( actionName, roleName ) {
		var result = undefined;
		var role   = this.roles[roleName];
		var action;
		if( !role ) {
			throw new Error('Role not found: '+roleName);
		} else if( !this.defaultRole.action(actionName) ) {
			throw new Error('Action not defined on default role: '+actionName);
		}
		
		while( role ) {
			if( action = role.action(actionName) ) {
				result = defaults(result || {}, action);
			}
			role = role.inherits;
		}
		return result;
	},
	getErrorMessage: function( actionName, roleName ) {
		var action = this.getAction(actionName, roleName);
		return result(action, 'message') || this.options.defaultError;
	},
	
	// Used by `can` to assign a helper function to `req.can` and `res.locals.can`.
	_addHelperFunction: function( req, res, actions ) {
		var locals = res.locals;
		if( locals.can ) {
			extend(locals.can.actions, actions);
		} else {
			// Passing multiple action names means `OR`.
			req.can = locals.can = function can( actionName /* [, actionName...] */ ) {
				if( !(actionName in can.actions) ) {
					throw new Error('RolePlay action not available for this route: '+actionName);
				}
				var len = arguments.length;
				for( var i=0; i<len; i++ ) {
					if( can.actions[arguments[i]] ) return true;
				}
				return false;
			};
			locals.can.actions = actions;
		}
	},
	// Used by `can` to expand action names like `entity:*` to a list of fully
	// qualified action names (e.g.: `entity:edit`, `entity:create` etc);
	_getCanonicalActionNames: function( actionNames ) {
		var role = this.defaultRole;
		var canonical = new Set;
		for( let actionName of actionNames ) {
			if( ~String(actionName).indexOf('*') ) {
				let sourceName = actionName.split(':');
				for( let actionName of Object.keys(role.actions) ) {
					let targetName = actionName.split(':');
					let i = 0, part;
					while( part = targetName.shift() ) {
						if( sourceName[i] != '*' && sourceName[i] != part ) {
							break;
						}
						i++;
					}
					if( i == sourceName.length ) {
						canonical.add(actionName);
					}
				}
			} else {
				canonical.add(actionName);
			}
		}
		
		return Array.from(canonical);
	}
});

function Role( mgr, roleName ) {
	this.mgr     = mgr;
	this.name    = roleName;
	this.actions = {};
}
extend(Role.prototype, {
	mgr      : undefined,
	name     : undefined,
	actions  : undefined,
	inherits : undefined,
	
	role: function( roleName ) {
		var role = new this.constructor(this.mgr, roleName);
		role.inherits = this;
		return this.mgr.role(role);
	},
	
	// def = boolean || allowFunction || {
	// 	allow     : boolean || function(user[, resource], actionName) { return boolean },
	// 	[resource : name || [name, ...] || function( mixed ) { return resource }],
	// 	[message  : string]
	// }
	// 
	// If `resource` is an array of strings, the `allow` function will receive
	// a resource object where the string values from the array are properties
	// on the object with the corresponding resource as value.
	action: function( actionName, def ) {
		var action;
		// This call is a getter, or it's an object of action definitions.
		if( arguments.length === 1 ) {
			if( typeof actionName === 'object' ) {
				forOwn(actionName, function( def, actionName ) {
					this.action(actionName, def);
				}.bind(this));
				return this;
			} else {
				// Get action.
				if( typeof actionName !== 'string' ) {
					throw new Error('Incorrect action name: '+actionName);
				}
				action = this.actions[actionName];
				if( !action ) {
					var parts = actionName.split(':');
					while( !action && parts.pop() ) {
						action = this.actions[parts.join(':')+':*'];
					}
				}
				return action || this.actions['*'];
			}
		}
		
		var resource, allow, message;
		if( def instanceof Object && def.constructor === Object ) {
			resource = def.resource;
			allow    = def.allow;
			message  = def.message;
		} else {
			allow    = def;
		}
		
		if( this.actions[actionName] ) {
			throw new Error('Action already defined: '+actionName);
		}
		if( typeof allow !== 'function' ) {
			allow = this._createAllowFunction(allow);
		}
		if( resource && typeof resource !== 'function' ) {
			resource = this._createResourceFunction(resource);
		}
		
		action = this.actions[actionName] = {
			name           : actionName,
			resource       : resource,
			allow          : allow,
			message        : message
		};
		return this;
	},
	
	_createAllowFunction: function( allowValue ) {
		return function() { return !!allowValue };
	},
	_createResourceFunction: function( resourceDef ) {
		function get( input, resourceName ) {
			var resource = arguments.length > 1 ?
			               input && input[resourceName] :
			               input;
			if( resource == undefined ) {
				resourceName = resourceName ? '\''+resourceName+'\'' : '';
				throw Error('Action \''+this.name+'\' missing resource '+resourceName);
			}
			return resource;
		}
		
		return function( input /* [, input...] */ ) {
			var len = arguments.length;
			if( len > 1 ) {
				if( !Array.isArray(resourceDef) || len != resourceDef.length ) {
					throw Error('Action \''+this.name+'\' missing resource');
				}
				var resources = [];
				for( let i=0; i<len; i++ ) {
					resources.push(arguments[i]);
				}
				return resources;
			} else if(
				input instanceof http.IncomingMessage ||
				Array.isArray(resourceDef)
			) {
				return castArray(resourceDef).map(get.bind(this, input));
			} else {
				return [get.call(this, input)];
			}
		};
	}
});

function Play( mgr, user ) {
	this.mgr  = mgr;
	this.user = user;
	this.role = this._getUserRole(user);
}
extend(Play.prototype, {
	mgr      : undefined,
	user     : undefined,
	role     : undefined,
	resource : undefined,
	
	can: function( actionName /* [, resource...] */ ) {

		var action = this.get(actionName);
		if( !action ) {
			throw new Error('Action not found: '+actionName);
		}
    
		if( action.resource ) {
			var resourceArgs = Array.prototype.slice.call(arguments, 1);
			var resources    = action.resource.apply(action, resourceArgs);
			var allowArgs    = [this.user].concat(resources, actionName);
			return action.allow.apply(action, allowArgs);
		} else {
			return action.allow(this.user, actionName);
		}
	},
	get: function( actionName ) {
		return this.mgr.getAction(actionName, this.role);
	},
	getErrorMessage: function( actionName ) {
		return this.mgr.getErrorMessage(actionName, this.role);
	},
	
	_getUserRole: function( user ) {
		return user.role;
	}
});
