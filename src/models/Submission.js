const config = require('config');
var Sequelize = require('sequelize');

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
				let newValue = {};

				value = value;

				/*
				const configExtraData = [];
				if (configExtraData) {
					Object.keys(configExtraData).forEach((key) => {
						if (configExtraData[key].allowNull === false && (typeof value[key] === 'undefined' || value[key] === '')) { // TODO: dit wordt niet gechecked als je het veld helemaal niet meestuurt
							// zie validExtraData hieronder
							// throw db.sequelize.ValidationError(`${key} is niet ingevuld`);
						}
						if (value[key] && configExtraData[key].values.indexOf(value[key]) != -1) { // TODO: alles is nu enum, maar dit is natuurlijk veel te simpel
							newValue[key] = value[key];
						}
					});
				}
				*/

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
                let conditions = {
                    [Sequelize.Op.and]: []
                };
                
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
                
                filterKeys.forEach((filter, i) => {
                    //first add include filters
                    if (filtersInclude) {
                        let filterValue = filtersInclude[filter.key];
                        
                        if (filtersInclude[filter.key]) {
                            if (filter.extraData) {
                                filterValue = Array.isArray(filterValue) ? filterValue : [filterValue];
                                
                                const escapedKey = sequelize.escape(`$.${filter.key}`);
                                filterValue.forEach((value, key) => {
                                    const escapedValue = sequelize.escape(value);
                                    conditions[Sequelize.Op.and].push({
                                        [Sequelize.Op.and]: sequelize.literal(`extraData->${escapedKey}=${escapedValue}`)
                                    });
                                });
                                
                            } else {
                                conditions[Sequelize.Op.and].push({
                                    [filter.key]: filterValue
                                });
                            }
                        }
                    }
                    
                    //add exclude filters
                    if (filtersExclude) {
                        let excludeFilterValue = filtersExclude[filter.key];
                        
                        if (excludeFilterValue) {
                            if (filter.extraData) {
                                excludeFilterValue = Array.isArray(excludeFilterValue) ? excludeFilterValue : [excludeFilterValue];
                                
                                //filter out multiple conditions
                                const escapedKey = sequelize.escape(`$.${filter.key}`);
                                excludeFilterValue.forEach((value, key) => {
                                    const escapedValue = sequelize.escape(value);
                                    conditions[Sequelize.Op.and].push({
                                        [Sequelize.Op.and]: sequelize.literal(`extraData->${escapedKey}!=${escapedValue}`)
                                    });
                                })
                            }
                        }
                    }
                });
                
                return {
                    where: sequelize.and(conditions)
                }
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
