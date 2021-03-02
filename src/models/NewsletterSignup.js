const Sequelize = require('sequelize');
const config = require('config');
const emailBlackList = require('../../config/mail_blacklist')
const sanitize = require('../util/sanitize');

const getExtraDataConfig = require('../lib/sequelize-authorization/lib/getExtraDataConfig');

module.exports = function( db, sequelize, DataTypes ) {

	var NewsletterSignup = sequelize.define('newslettersignup', {

		siteId: {
			type         : DataTypes.INTEGER,
			defaultValue : config.siteId && typeof config.siteId == 'number' ? config.siteId : 0,
		},

		email: {
			type         : DataTypes.STRING(255),
			allowNull    : true,
			validate     : {
				isEmail: {
					msg: 'Geen geldig emailadres'
				},
				notBlackListed: function( email ) {
					var match = email && email.match(/^.+@(.+)$/);
					if (match) {
						let domainName = match[1];
						if( domainName in emailBlackList ) {
							throw Error('Graag je eigen emailadres gebruiken; geen tijdelijk account');
						}
					}
				}
			},
		},

		firstName: {
			type         : DataTypes.STRING(64),
			allowNull    : true,
			set          : function( value ) {
				this.setDataValue('firstName', value ? sanitize.noTags(value) : null);
			}
		},

		lastName: {
			type         : DataTypes.STRING(64),
			allowNull    : true,
			set          : function( value ) {
				this.setDataValue('lastName', value ? sanitize.noTags(value) : null);
			}
		},

    externalUserId: {
      type         : DataTypes.INTEGER,
			allowNull    : true,
			defaultValue : null,
      auth: {
        viewableBy: ['admin', 'owner'],
      },
    },

		confirmed: {
			type         : DataTypes.BOOLEAN,
			allowNull    : false,
			defaultValue : false
		},

    extraData: getExtraDataConfig(DataTypes.JSON, 'newslettersignups'),


		confirmToken: {
			type         : DataTypes.STRING(512),
			allowNull    : true,
			defaultValue : null,
      auth: {
        viewableBy: ['admin', 'owner'],
      },
		},

		signoutToken: {
			type         : DataTypes.STRING(512),
			allowNull    : true,
			defaultValue : null,
      auth: {
        viewableBy: ['admin', 'owner'],
      },
		},

	});

	NewsletterSignup.scopes = function() {

		return {
			forSiteId: function( siteId ) {
				return {
					where: {
						siteId: siteId,
					}
				};
			},
			includeSite: {
				include: [{
					model: db.Site,
				}]
			},

		}

	}

	NewsletterSignup.associate = function( models ) {
		this.belongsTo(models.Site);
	}

  // dit is hoe het momenteel werkt; ik denk niet dat dat de bedoeling is, maar ik volg nu
	NewsletterSignup.auth = NewsletterSignup.prototype.auth = {
    listableBy: 'editor',
    viewableBy: ['editor', 'owner'],
    createableBy: 'all',
    updateableBy: 'admin',
    deleteableBy: 'admin',
    canConfirm: function(user, self) {
      // all; specific checks are in the route (TODO: move those to here)
      return true;
    },
    canSignout: function(user, self) {
      // all; specific checks are in the route (TODO: move those to here)
      return true;
    },
  }

	return NewsletterSignup;

};
