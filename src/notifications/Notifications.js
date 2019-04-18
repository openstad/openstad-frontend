'use strict';

const extend       = require('lodash/extend');
const forEach      = require('lodash/forEach');
const Promise      = require('bluebird');

// Notifications manager
// ---------------------
function Notifications() {
	this.publications = new Map;
}
extend(Notifications.prototype, {
	subscribe: function( pubName, userId, assetName, assetId, eventNames ) {
		if( arguments.length != 5 ) {
			return Promise.reject(Error('Incorrect argument count'));
		}
		if( userId == undefined ) {
			return Promise.reject(Error('No user ID'));
		}
		if( !Array.isArray(eventNames) ) {
			eventNames = [eventNames];
		}
		
		var pub = this.publications.get(pubName);
		if( !pub ) {
			return Promise.reject(Error(`Missing publication: ${pubName}`));
		}
		return pub.addEventListener(userId, assetName, assetId, eventNames);
	},
	unsubscribe: function( pubName, userId, assetName, assetId, eventNames ) {
		if( arguments.length != 5 ) {
			return Promise.reject(Error('Incorrect argument count'));
		}
		if( userId == undefined ) {
			return Promise.reject(Error('No user ID'));
		}
		if( !Array.isArray(eventNames) ) {
			eventNames = [eventNames];
		}
		
		var pub = this.publications.get(pubName);
		if( !pub ) {
			return Promise.reject(Error(`Missing publication: ${pubName}`));
		}
		return pub.removeEventListener(userId, assetName, assetId, eventNames);
	},
	
	addPublication: function( publication ) {
		if( this.publications.has(publication.name) ) {
			return Promise.reject(Error(`Duplicate publication name: ${publication.name}`));
		}
		this.publications.set(publication.name, publication);
		return publication;
	},
	
	trigger: function( sourceUserId, assetName, assetId, eventName ) {
		var events = [];
		
		this.publications.forEach(function( publication, pubName ) {
			events.push(
				publication.onEvent(sourceUserId, assetName, assetId, eventName)
			);
		}, this);
		
		return Promise.all(events).return(true);
	}
});

Notifications.query2RegExp = function( query ) {
	query = String(query).replace(/:?\*:?/g, function( match ) {
		switch( match ) {
			case '*:':
				return '(?:[^:]+:)?';
			case ':*':
				return '(?::[^:]+)?';
			case ':*:':
				return '(?::[^:]+:)|:';
			case '*':
				return '(?:.*?)';
		}
	});
	return new RegExp('^'+query+'$');
};

// Publication
// -----------
// options: {
// 	[autoSend: false,]
// 	assets: {
// 		<assetName>: [{
// 			events    : [eventName,...]
// 			frequency : 0
// 		}>, ...]
// 	},
// 	sendMessage: handler<function(users)>
// }
function Publication( name, store, options ) {
	if( !options.sendMessage ) {
		throw Error('Missing `options.sendMessage` handler');
	}
	
	this.name   = name;
	this.store  = store;
	this.assets = this._processEvents(options.assets);
	
	delete options.assets;
	options.autoSend = 'autoSend' in options ?
	                   !!options.autoSend :
	                   false;
	this.options     = options;
}
extend(Publication.prototype, {
	name    : undefined,
	store   : undefined,
	assets  : undefined,
	options : undefined,
	
	addEventListener: function( userId, assetName, assetId, eventNames ) {
		return this.store.addEventListener(this.name, userId, assetName, assetId, eventNames);
	},
	removeEventListener: function( userId, assetName, assetId, eventNames ) {
		return this.store.removeEventListener(this.name, userId, assetName, assetId, eventNames);
	},
	
	// Called by `Notifications.trigger`.
	onEvent: function( sourceUserId, assetName, assetId, eventName, userIds ) {
		this.store.getUsersForEvent(this.name, sourceUserId, assetName, assetId, eventName)
		.bind(this)
		.then(function( userIds ) {
			var options = userIds.size ?
			              this._getEventOptions(assetName, eventName) :
			              undefined;
			return options ?
			       this.queue(assetName, assetId, eventName, userIds, options) :
			       null;
		})
		.tap(function() {
			if( this.options.autoSend ) {
				return this.processQueue();
			}
		});
	},
	queue: function( assetName, assetId, eventName, userIds, options ) {
		return this.store.queueEvent(this.name, assetName, assetId, eventName, userIds, options);
	},
	processQueue: function() {
		return this.store.iterateQueue(this.name, function( user ) {
			return this.sendMessage(user);
		}, this);
	},
	sendMessage: function( user ) {
		return this.store.userWantsMessage(this.name, user.id)
		.bind(this)
		.tap(function( userWantsMessage ) {
			if( userWantsMessage ) {
				return Promise.all([
					this.options.sendMessage.call(this, user),
					this.store.updateLastMessageDate(this.name, user.id, new Date()),
					this.store.clearQueue(this.name, user.id)
				]);
			}
		})
	},
	
	_getEventOptions: function( assetName, eventName ) {
		var asset = this.assets.get(assetName) || this.assets.get('*');
		if( !asset ) return false;
		
		var def = asset.find(function( def ) {
			return def.events.find(function( regex ) {
				return regex.test(eventName);
			});
		});
		return def;
	},
	// Used in constructor.
	_processEvents: function( assets ) {
		var map = new Map;
		
		forEach(assets, function( optionSet, assetName ) {
			if( !Array.isArray(optionSet) ) {
				optionSet = [optionSet];
			}
			
			optionSet = optionSet.map(function( options ) {
				if( !Array.isArray(options.events) ) {
					throw Error('Asset definition requires an events array');
				}
				
				return extend({
					frequency: 0
				}, options, {
					events : options.events.map(Notifications.query2RegExp)
				});
			});
			
			map.set(assetName, optionSet);
		});
		
		return map;
	}
});

// Store
// -----
function Store() {}
extend(Store.prototype, {
	addEventListener      : function( pubName, userId, assetName, assetId, eventNames ) {},
	removeEventListener   : function( pubName, userId, assetName, assetId, eventNames ) {},
	getUsersForEvent      : function( pubName, sourceUserId, assetName, assetId, eventName ) {},
	
	queueEvent            : function( pubName, assetName, assetId, eventName, userIds, options ) {},
	iterateQueue          : function( pubName, callback, ctx ) {},
	removeQueueUser       : function( pubName, userId ) {},
	clearQueue            : function( pubName ) {},
	
	userWantsMessage      : function( pubName, userId ) {},
	updateLastMessageDate : function( pubName, userId, time ) {},
});

// Export
// ------
Notifications.Notifications = Notifications;
Notifications.Publication   = Publication;
Notifications.Store         = Store;
module.exports              = Notifications;
