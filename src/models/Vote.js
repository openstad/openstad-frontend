var config = require('config');

module.exports = function( db, sequelize, DataTypes ) {
	var Vote = sequelize.define('vote', {
		ideaId: {
			type         : DataTypes.INTEGER,
			allowNull    : false
		},
		userId: {
			type         : DataTypes.INTEGER,
			allowNull    : false,
			defaultValue: 0,
		},
		confirmed: {
			type         : DataTypes.BOOLEAN,
			allowNull    : true,
			defaultValue : null
		},
		confirmReplacesVoteId: {
			type         : DataTypes.INTEGER,
			allowNull    : true,
			defaultValue : null
		},
		ip: {
			type         : DataTypes.STRING(64),
			allowNull    : true,
			validate     : {
				isIP: true
			}
		},
		opinion: {
			type         : DataTypes.STRING(64),
			allowNull    : true,
			defaultValue : null
		},
		// This will be true if the vote validation CRON determined this
		// vote is valid.
		checked : {
			type         : DataTypes.BOOLEAN,
			allowNull    : true
		}
	}, {
		indexes: [{
			fields : ['ideaId', 'userId'],
			unique : true
		}],
		// paranoid: false,
	});

	Vote.associate = function( models ) {
		Vote.belongsTo(models.Idea);
		Vote.belongsTo(models.User);
	}

	Vote.scopes = function scopes() {
		return {

			forSiteId: function( siteId ) {
				return {
					// where: {
					//  	ideaId: [ sequelize.literal(`select id FROM ideas WHERE siteId = ${siteId}`) ]
					// }
					include: [{
						model      : db.Idea,
						attributes : ['id', 'siteId'],
						required: true,
						where: {
							siteId: siteId
						}
					}],
				};
			},

		}

	}
	
	Vote.anonimizeOldVotes = function() {
		var anonimizeThreshold = config.get('ideas.anonimizeThreshold');
		return sequelize.query(`
					UPDATE
						votes v
					SET
						v.ip = NULL
					WHERE
						DATEDIFF(NOW(), v.updatedAt) > ${anonimizeThreshold} AND
						checked != 0
				`)
			.spread(function( result, metaData ) {
				return metaData;
			});
	}

	Vote.restoreOrInsert = function(data) {
		// ToDo: cleanup nesting
		return db.Vote
			.upsert(data)
			.then(result => {
				if ( result ) {
					return result
				} else {
					return db.Vote
						.restore({where: {ideaId: data.ideaId, userId: data.userId }})
						.then(result => {
							return db.Vote.findOne({where: {ideaId: data.ideaId, userId: data.userId }})
								.then(found => {
									return found.update(data);
								})
						})
				}
			})
	}

	Vote.prototype.toggle = function() {
		var checked = this.get('checked');
		return this.update({
			checked: checked === null ? false : !checked
		});
	}

	return Vote;
};
