const Sequelize = require('sequelize');
const config = require('config');
const emailBlackList = require('../../config/mail_blacklist')
const sanitize = require('../util/sanitize');

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
			}
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
			defaultValue : null
    },

		confirmed: {
			type         : DataTypes.BOOLEAN,
			allowNull    : false,
			defaultValue : false
		},

		confirmToken: {
			type         : DataTypes.STRING(512),
			allowNull    : true,
			defaultValue : null
		},

		signoutToken: {
			type         : DataTypes.STRING(512),
			allowNull    : true,
			defaultValue : null
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

		}

	}
	
	return NewsletterSignup;
	
};
