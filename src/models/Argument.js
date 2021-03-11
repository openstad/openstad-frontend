var sanitize = require('../util/sanitize');
var moment = require('moment-timezone');
var config = require('config')
const merge = require('merge');

// For detecting throwaway accounts in the email address validation.
var emailBlackList = require('../../config/mail_blacklist')
  , emailDomain    = /^.+@(.+)$/;

var notifications = require('../notifications');
const userHasRole = require('../lib/sequelize-authorization/lib/hasRole');

module.exports = function( db, sequelize, DataTypes ) {
	var Argument = sequelize.define('argument', {

		parentId: {
			type         : DataTypes.INTEGER,
      auth: {
        updateableBy : 'moderator',
      },
			allowNull    : true
		},

		ideaId: {
			type         : DataTypes.INTEGER,
      auth: {
        updateableBy : 'moderator',
      },
			allowNull    : false
		},

		userId: {
			type         : DataTypes.INTEGER,
      auth: {
        updateableBy : 'moderator',
      },
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
				// len: {
				//  	args : [30,500],
				//  	msg  : 'Bericht moet tussen 30 en 500 tekens zijn'
				// }
				textLength(value) {
				 	let len = sanitize.summary(value.trim()).length;
					let descriptionMinLength = ( this.config && this.config.arguments && this.config.arguments.descriptionMinLength || 30 )
					let descriptionMaxLength = ( this.config && this.config.arguments && this.config.arguments.descriptionMaxLength || 500 )
					if (len < descriptionMinLength || len > descriptionMaxLength)
					throw new Error(`Beschrijving moet tussen ${descriptionMinLength} en ${descriptionMaxLength} tekens zijn`);
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

			beforeValidate: function( instance, options ) {

				return new Promise((resolve, reject) => {

					if (instance.ideaId) {
						db.Idea.scope('includeSite').findByPk(instance.ideaId)
							.then( idea => {
								if (!idea) throw Error('Idea niet gevonden')
								instance.config = merge.recursive(true, config, idea.site.config);
								return idea;
							})
							.then( idea => {
								return resolve();
							}).catch(err => {
								throw err;
							})

					} else {
						instance.config = config;
            return resolve();
					}

				});

			},

			afterCreate: function(instance, options) {
				db.Idea.findByPk(instance.ideaId)
					.then( idea => {
						notifications.addToQueue({ type: 'argument', action: 'create', siteId: idea.siteId, instanceId: instance.id });
					})
			},

			afterUpdate: function(instance, options) {
				db.Idea.findByPk(instance.ideaId)
					.then( idea => {
						notifications.addToQueue({ type: 'argument', action: 'update', siteId: idea.siteId, instanceId: instance.id });
					})
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
					attributes : ['id', 'role', 'nickName', 'firstName', 'lastName', 'email']
				}]
			},

			forSiteId: function( siteId ) {
				return {
					where: {
						ideaId: [ sequelize.literal(`select id FROM ideas WHERE siteId = ${siteId}`) ]
					}
				};
			},

			includeReactionsOnReactions: function( userId ) {
				let argVoteThreshold = 5; // todo: configureerbaar
				return {
					include: [{
						model      : db.Argument,
						as         : 'reactions',
						required   : false,
            // force attribs because the automatic list is incomplete
					  attributes : ['id', 'parentId', 'ideaId', 'userId', 'sentiment', 'description', 'label', 'createdAt', 'updatedAt', 'createDateHumanized']
					}],
					where: {
						parentId: null
					},
					// HACK: Inelegant?
					order: [
//						sequelize.literal(`GREATEST(0, \`yes\` - ${argVoteThreshold}) DESC`),
						sequelize.literal('parentId'),
						sequelize.literal('createdAt')
					]
				};
			},

			withIdea: function() {
				return {
					include: [{
						model      : db.Idea,
						attributes : ['id', 'title', 'status', 'viewableByRole']
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

	Argument.auth = Argument.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: 'member',
    updateableBy: ['editor','owner'],
    deleteableBy: ['editor','owner'],
    canVote: function(user, self) {
      // TODO: ik denk dat je alleen moet kunnen voten bij idea.isOpen, maar dat doet hij nu ook niet. Sterker: hij checkt nu alleen maar op parentId.
      if (userHasRole(user, 'member') && self.id && !self.parentId) {
        return true;
      } else {
        return false;
      }
    },
    canReply: function(user, self) {
      if (!self.idea) return false;
      if (self.idea.isRunning() && userHasRole(user, 'member') && self.id && !self.parentId) {
        return true;
      } else {
        return false;
      }
    },
    toAuthorizedJSON(user, result, self) {
      // TODO: ik denk dat ik doit overal wil. Misschien met een scope of andere param.
      result.can = {};
      if ( self.can('reply', user) ) result.can.reply = true;
      if ( self.can('update', user) ) result.can.edit = true;
      if ( self.can('delete', user) ) result.can.delete = true;
      return result;
    }
  }

	return Argument;

}
