var config = require('config');

module.exports = function( db, sequelize, DataTypes ) {
	var ArgumentVote = sequelize.define('argument_vote', {

		argumentId: {
			type         : DataTypes.INTEGER,
			allowNull    : false
		},

		userId: {
			type         : DataTypes.INTEGER,
			allowNull    : false,
			defaultValue: 0,
		},

		ip: {
			type         : DataTypes.STRING(64),
			allowNull    : true,
			validate     : {
				isIP: true
			}
		},

		opinion: {
			type         : DataTypes.ENUM('no','yes'),
			allowNull    : false
		},

		// This will be true if the vote validation CRON determined this
		// vote is valid.
		checked : {
			type         : DataTypes.BOOLEAN,
			allowNull    : true
		}

	}, {
		indexes: [{
			fields : ['argumentId', 'userId'],
			unique : true
		}],

	});

	ArgumentVote.associate = function( models ) {
				ArgumentVote.belongsTo(models.Argument);
				ArgumentVote.belongsTo(models.User);
			}

	ArgumentVote.anonimizeOldVotes = function() {
		var anonimizeThreshold = config.get('ideas.anonimizeThreshold');
		return sequelize.query(`
					UPDATE
						argument_votes v
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

	ArgumentVote.prototype.toggle = function() {
		var checked = this.get('checked');
		return this.update({
			checked: checked === null ? false : !checked
		});
	}

	return ArgumentVote;

};
