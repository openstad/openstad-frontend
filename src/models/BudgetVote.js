const config = require('config');

module.exports = function( db, sequelize, DataTypes ) {

	var BudgetVote = sequelize.define('budgetVote', {

		siteId: {
			type         : DataTypes.INTEGER,
			defaultValue : config.siteId && typeof config.siteId == 'number' ? config.siteId : 0,
		},

		userId: {
			type         : DataTypes.STRING,
			defaultValue : null,
			allowNull    : 0,
		},

		userIp: {
			type         : DataTypes.STRING(64),
			allowNull    : true,
			validate     : {
				isIP: true
			}
		},

		vote: {
			type         : DataTypes.STRING,
			defaultValue : '[]',
			allowNull    : false,
		},

	});

	BudgetVote.associate = function( models ) {
		// BudgetVote.hasMany(models.Idea);
	}

	BudgetVote.scopes = function() {

		let scopes = {};

		if (config.siteId && typeof config.siteId == 'number') {
			scopes.siteScope = {
				where: {
					siteId: config.siteId,
				}
			}
		}
		
		return scopes;
	}
	
	return BudgetVote;

};
