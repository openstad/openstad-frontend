const config = require('config');
const Sequelize = require('sequelize');
const getSequelizeConditionsForFilters = require('./../util/getSequelizeConditionsForFilters');

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
			type         : DataTypes.TEXT,
			allowNull    : true
		},

		status: {
			type         : DataTypes.ENUM('approved','pending','unapproved'),
			defaultValue : 'pending',
			allowNull    : false
		},

		submittedData: {
			type         : DataTypes.TEXT,
			allowNull    : false,
			defaultValue : {},
			get          : function() {
				// for some reaason this is not always done automatically
				let value = this.getDataValue('submittedData');
				try {
					if (typeof value == 'string') {
						value = JSON.parse(value);
					}
				} catch(err) {}
				return value;
			},
			set: function(value) {
				try {
					if (typeof value == 'string') {
						value = JSON.parse(value);
					}
				} catch(err) {}

				this.setDataValue('submittedData', JSON.stringify(value));
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
            forSiteId: function (siteId) {
                return {
                    where: {
                        siteId: siteId,
                    }
                };
            },
            filter:    function (filtersInclude, filtersExclude) {
                const filterKeys = [
                    {
                        'key': 'id'
                    },
                    {
                        'key': 'status'
                    },
                    {
                        'key': 'formId'
                    },
                ];
    
                return getSequelizeConditionsForFilters(filterKeys, filtersInclude, sequelize, filtersExclude);
            },
		};
	}

	Submission.auth = Submission.prototype.auth = {
    listableBy: 'admin',
    viewableBy: ['admin', 'owner'],
    createableBy: 'all',
    updateableBy: 'admin',
    deleteableBy: 'admin',
  }

	return Submission;
};
