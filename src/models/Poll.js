var sanitize = require('../util/sanitize');
var config = require('config')
const merge = require('merge');

const userHasRole = require('../lib/sequelize-authorization/lib/hasRole');

module.exports = function( db, sequelize, DataTypes ) {
	var Poll = sequelize.define('poll', {

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

		status: {
      type: DataTypes.ENUM('OPEN', 'CLOSED'),
      auth:  {
        updateableBy: 'editor',
      },
      defaultValue: 'OPEN',
      allowNull: false
		},

		question: {
			type         : DataTypes.STRING,
			allowNull    : false,
      set: function (text) {
        this.setDataValue('question', sanitize.title(text.trim()));
      }
		},

    choices: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '{}',
      get: function () {
        let value =  this.getDataValue('choices');
        try {
          if (typeof value == 'string') {
            value = JSON.parse(value);
          }
        } catch (err) {
        }
        return value;
      },
      set: function (value) {
        try {
          if (typeof value == 'string') value = JSON.parse(value);
        } catch (err) {}
        if ( typeof value != 'object' ) value = {};
        let sanatized = {};
        Object.keys(value).forEach((key) => {
          let skey = sanitize.title(key);
          sanatized[skey] = {};
          let sanatizedTitle = sanitize.title(value[key].title || '')
          sanatized[skey].title = sanatizedTitle;
          let sanatizedDescription = sanitize.title(value[key].description || '')
          sanatized[skey].description = sanatizedDescription;
        });
        this.setDataValue('choices', JSON.stringify(sanatized));
      },
      auth: {
        authorizeData: function(data, action, user, self, site) {
          // todo
          data = data || self.choices;
          return data;
        },
      }
    },

		userVote: {
			type         : DataTypes.VIRTUAL
		},

		voteCount: {
			type         : DataTypes.VIRTUAL
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

		},

		individualHooks: true,

	});

	Poll.scopes = function scopes() {

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

			withIdea: function() {
				return {
					include: [{
						model      : db.Idea,
						attributes : ['id', 'title', 'status']
					}]
				}
			},

			withUser: {
				include: [{
					model      : db.User,
					as         : 'user',
					required   : false
				}]
			},

			withUserVote: function( tableName, userId ) {
				userId = Number(userId);
				if( !userId ) return {};

				return {
					attributes: Object.keys(this.rawAttributes).concat([
						[sequelize.literal(`
							(SELECT
								choice
							FROM
								pollVotes pv
							WHERE
								pv.deletedAt IS NULL AND
								pv.pollId = ${tableName}.id AND
								pv.userId     = ${userId})
						`), 'userVote']
					])
				};
			},

			withVotes: function() {
				return {
					include: [{
						model: db.PollVote,
            as: 'votes',
						attributes: ['id', 'choice']
					}]
				}
			},

		}
	}

	Poll.associate = function( models ) {
		this.belongsTo(models.Idea);
		this.belongsTo(models.User);
		this.hasMany(models.PollVote, {
			as: 'votes'
		});
	}

	Poll.auth = Poll.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: 'member',
    updateableBy: ['editor','owner'],
    deleteableBy: ['editor','owner'],
    canUpdate: function(user, self) {
      let votes = self.getDataValue('votes');
      return userHasRole(user, 'editor') || ( userHasRole(user,'owner', self.userId) && !( votes && votes.length ) )
    },
    canDelete: function(user, self) {
      let votes = self.getDataValue('votes');
      return userHasRole(user, 'editor') || ( userHasRole(user,'owner', self.userId) && !( votes && votes.length ) )
    },
    canVote: function(user, self) {
      if (!self.idea) return false;
      if (self.idea.isRunning() && userHasRole(user, 'member') && self.id && self.status == 'OPEN') {
        return true;
      } else {
        return false;
      }
    },
    toAuthorizedJSON(user, result, self) {
      result.can = {};
      if ( self.can('vote', user) ) result.can.vote = true;
      if ( self.can('update', user) ) result.can.edit = true;
      if ( self.can('delete', user) ) result.can.delete = true;
      return result;
    }
  }

	Poll.prototype.countVotes = function(deleteVotes) {
    if (!this.votes || !this.votes.length) return;
    this.voteCount= { total: 0 };
    this.votes.forEach((vote) => {
      if (!this.voteCount[vote.choice]) this.voteCount[vote.choice] = 0;
      this.voteCount[vote.choice]++;
      this.voteCount.total++;
    });
    if (deleteVotes) delete this.votes;
  }

	return Poll;

}

