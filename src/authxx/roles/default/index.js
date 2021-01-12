var config   = require('config');
var RolePlay = require('../../RolePlay');

var auth = new RolePlay({
	defaultError    : 'Geen toegang',
	defaultRoleName : 'unknown'
});

var unknown   = auth.role('unknown');
var anonymous = unknown.role('anonymous');
var member    = anonymous.role('member');

var admin     = member.role('admin');
var editor    = member.role('editor');
var moderator = member.role('moderator');

var helpers = {

	maySeeArgForm: function( user, idea ) {
		return idea.isRunning();
	},

	maySeeReplyForm: function( user, idea ) {
		return idea.isRunning();
	},

	mayAddArgument: function( user, idea ) {
		if (process.NODE_ENV == 'stemtool') {
			return idea.isRunning();
		} else {
			return idea.isRunning() && ( ( user && user.id != 1 ) || ( config.arguments && config.arguments.user && config.arguments.user.anonymousAllowed ) );
		}
	},

	mayReplyToArgument: function( user, idea, argument ) {
		return !argument.parentId &&
		       idea.isRunning();
	},

	// TODO: Deny when arg replies exist.
	mayMutateArgument: function( user, argument, idea ) {
		return user.id === argument.userId &&
		       idea.isRunning();
	},

};

require('./default-unknown')(helpers, unknown);
require('./anonymous')(helpers, anonymous);
require('./member')(helpers, member);
require('./admin')(helpers, admin);
require('./editor')(helpers, editor);
require('./moderator')(helpers, moderator);


module.exports = auth;
