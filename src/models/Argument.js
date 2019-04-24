var sanitize = require('../util/sanitize');
var moment = require('moment-timezone');

// For detecting throwaway accounts in the email address validation.
var emailBlackList = require('../../config/mail_blacklist')
  , emailDomain    = /^.+@(.+)$/;

var notifications = require('../notifications');

module.exports = function( db, sequelize, DataTypes ) {
	var Argument = sequelize.define('argument', {

		parentId: {
			type         : DataTypes.INTEGER,
			allowNull    : true
		},

		ideaId: {
			type         : DataTypes.INTEGER,
			allowNull    : false
		},

		userId: {
			type         : DataTypes.INTEGER,
			allowNull    : false,
			defaultValue: 0,
		},

		sentiment: {
			type         : DataTypes.ENUM('against', 'for'),
			defaultValue : 'for',
			allowNull    : false
		},

		description: {
			type         : DataTypes.TEXT,
			allowNull    : false,
			validate     : {
				len: {
					args : [30,500],
					msg  : 'Bericht moet tussen 30 en 500 tekens zijn'
				}
			},
			set          : function( text ) {
				this.setDataValue('description', sanitize.argument(text));
			}
		},

		label: {
			type         : DataTypes.STRING,
			allowNull    : true
		},
		// Counts set in `withVoteCount` scope.

		yes: {
			type         : DataTypes.VIRTUAL
		},

		hasUserVoted: {
			type         : DataTypes.VIRTUAL
		},

		createDateHumanized: {
			type         : DataTypes.VIRTUAL,
			get          : function() {
				var date = this.getDataValue('createdAt');
				try {
					if( !date )
						return 'Onbekende datum';
					return  moment(date).format('LLL');
				} catch( error ) {
					return (error.message || 'dateFilter error').toString()
				}
			}
		},

	}, {

		hooks: {

			afterCreate: function(instance, options) {
				notifications.trigger(instance.userId, 'arg', instance.id, 'create');
			},

			afterUpdate: function(instance, options) {
				notifications.trigger(instance.userId, 'arg', instance.id, 'update');
			},
			
		},

		individualHooks: true,

	});

	Argument.scopes = function scopes() {
		// Helper function used in `withVoteCount` scope.
		function voteCount( tableName, opinion ) {
			return [sequelize.literal(`
				(SELECT
					COUNT(*)
				FROM
					argument_votes av
				WHERE
					av.deletedAt IS NULL AND (
						av.checked IS NULL OR
						av.checked  = 1
					) AND
					av.argumentId = ${tableName}.id AND
					av.opinion    = "${opinion}")
			`), opinion];
		}
		
		return {

			defaultScope: {
				include: [{
					model      : db.User,
					attributes : ['role', 'nickName', 'firstName', 'lastName', 'email']
				}]
			},

			forSiteId: function( siteId ) {
				return {
					where: {
						ideaId: [ sequelize.literal(`select id FROM ideas WHERE siteId = ${siteId}`) ]
					}
				};
			},

			withIdea: function() {
				return {
					include: [{
						model      : db.Idea,
						attributes : ['id', 'status']
					}]
				}
			},

			withVoteCount: function( tableName ) {
				return {
					attributes: Object.keys(this.rawAttributes).concat([
						voteCount(tableName, 'yes')
					])
				};
			},

			withUserVote: function( tableName, userId ) {
				userId = Number(userId);
				if( !userId ) return {};
				
				return {
					attributes: Object.keys(this.rawAttributes).concat([
						[sequelize.literal(`
							(SELECT
								COUNT(*)
							FROM
								argument_votes av
							WHERE
								av.deletedAt IS NULL AND (
									av.checked IS NULL OR
									av.checked  = 1
								) AND
								av.argumentId = ${tableName}.id AND
								av.userId     = ${userId})
						`), 'hasUserVoted']
					])
				};
			},

			withUser: {
				include: [{
					model      : db.User,
					as         : 'user',
					required   : false
				}]
			},

			withReactions: {
				include: [{
					model      : db.Argument,
					as         : 'reactions',
					required   : false
				}]
			},

		}
	}

	Argument.associate = function( models ) {
		this.belongsTo(models.Idea);
		this.belongsTo(models.User);
		this.hasMany(models.ArgumentVote, {
			as: 'votes'
		});
		this.hasMany(models.Argument, {
			foreignKey : 'parentId',
			as         : 'reactions'
		});
	}
	
	Argument.prototype.addUserVote = function( user, opinion, ip ) {
		var data = {
			argumentId : this.id,
			userId     : user.id,
			opinion    : opinion,
			ip         : ip
		};
		
		// See `Idea.addUserVote` for an explanation of the logic below.
		return db.ArgumentVote.findOne({where: data})
			.then(function( vote ) {
				if( vote ) {
					return vote.destroy();
				} else {
					// HACK: See `Idea.addUserVote`.
					data.deletedAt = null;
					return db.ArgumentVote.upsert(data);
				}
			})
			.then(function( result ) {
				return result && !!result.deletedAt;
			});
	}
	
	return Argument;

}
