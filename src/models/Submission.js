const config = require('config');

module.exports = function( db, sequelize, DataTypes ) {
	var Submission = sequelize.define('submission', {

		siteId: {
			type         : DataTypes.INTEGER,
			defaultValue : config.siteId && typeof config.siteId == 'number' ? config.siteId : 0,
		},

		userId: {
			type         : DataTypes.INTEGER,
			allowNull    : true
		},
		
		formId: {
			type 		 : DataTypes.STRING,
			allowNull	 : true
		},

		status: {
			type         : DataTypes.ENUM('approved','pending','unapproved'),
			defaultValue : 'pending',
			allowNull    : false
		},

		submittedData: {
			type:         DataTypes.TEXT,
			allowNull:    false,
			defaultValue: {},
			get:          function () {
				// for some reaason this is not always done automatically
				let value = this.getDataValue('submittedData');
				try {
					if (typeof value == 'string') {
						value = JSON.parse(value);
					}
				} catch (err) {}
				return value;
			},
			set:          function (value) {
				try {
					if (typeof value == 'string') {
						value = JSON.parse(value);
					}
				} catch (err) {}
				
				let newValue = {},
					i        = 0;
				
				// MySQL JSON fields are terrible. It sorts the keys randomly, so we can't trust that order anymore
				// Therefore, we insert a number in front of the key to be able to re-establish
				// the order later on.
				Object.keys(value).forEach(function (key) {
					i++;
					newValue[i + ':' + key] = value[key];
				});
				
				this.setDataValue('submittedData', JSON.stringify(newValue));
			}
		},

	});

	Submission.scopes = function scopes() {
		return {
			defaultScope: {
				/*include: [{
					model      : db.User,
					attributes : ['role', 'nickName', 'firstName', 'lastName', 'email']
					}]*/
			},
			withUser: {
				include: [{
					model      : db.User,
					attributes : ['role', 'nickName', 'firstName', 'lastName', 'email']
				}]
			},
		};
	}

	return Submission;
};
