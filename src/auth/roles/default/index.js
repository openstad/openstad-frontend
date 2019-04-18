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

var helpers = {
	needsToCompleteRegistration: function( user ) {
		return !user.hasCompletedRegistration();
	},
	
	mayMutateIdea: function( user, idea ) {
		if( !idea.isOpen() ) {
			return false;
		}
		// TODO: Time sensitivity?
		var isOwner   = helpers.isIdeaOwner(user, idea);
		var voteCount = idea.no + idea.yes;
		var argCount  = idea.argumentsFor && idea.argumentsFor.length && idea.argumentsAgainst && idea.argumentsAgainst.length;
		return isOwner && !voteCount && !argCount;
	},
	
	mayVoteIdea: function( user, idea ) {
		return idea.isOpen();
	},
	
	mayMutateArgument: function( user, argument ) {
		var isOwner   = helpers.isArgumentOwner(user, argument);
		return isOwner;
	},
	
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
	mayMutateArgument: function( user, idea, argument ) {
		return user.id === argument.userId &&
		       idea.isRunning();
	},

	mayVoteArgument: function( user, idea, argument ) {
		return !argument.parentId;
	},
	
	isIdeaOwner: function( user, idea ) {
		return user.id === idea.userId;
	},
	
	isArgumentOwner: function( user, argument ) {
		return user.id === argument.userId;
	},

};

require('./default-unknown')(helpers, unknown);
require('./anonymous')(helpers, anonymous);
require('./member')(helpers, member);
require('./admin')(helpers, admin);

module.exports = auth;
