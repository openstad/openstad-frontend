const sanitize = require('../util/sanitize');
const config = require('config');
const getExtraDataConfig = require('../lib/sequelize-authorization/lib/getExtraDataConfig');

module.exports = function( db, sequelize, DataTypes ) {

	var Tag = sequelize.define('tag', {

		siteId: {
			type         : DataTypes.INTEGER,
			allowNull    : false,
		},

		name: {
			type         : DataTypes.STRING,
			allowNull    : false,
			set          : function( text ) {
				this.setDataValue('name', sanitize.title(text.trim()));
			}
		},

		extraData:{
		    type: DataTypes.JSON,
		    allowNull: false,
		    defaultValue: '{}',
		    get: function () {
		      let value =  this.getDataValue('extraData');
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
		        if (typeof value == 'string') {
		          value = JSON.parse(value);
		        }
		      } catch (err) {
		      }

		      let oldValue =  this.getDataValue('extraData');
		      try {
		        if (typeof oldValue == 'string') {
		          oldValue = JSON.parse(oldValue) || {};
		        }
		      } catch (err) {
		      }

		      function fillValue(old, val) {
		        old = old || {};
		        Object.keys(old).forEach((key) => {
		          if (val[key] && typeof val[key] == 'object') {
		            return fillValue(old[key], val[key]);
		          }
		          if (val[key] === null) {
		            // send null to delete fields
		            delete val[key];
		          } else if (typeof val[key] == 'undefined') {
		            // not defined in put data; use old val
		            val[key] = old[key];
		          }
		        });
		      }

		      fillValue(oldValue, value);

		      this.setDataValue('extraData', JSON.stringify(value));
		    },
		    auth: {
		      authorizeData: function(self, action, user, data) {
						const siteConfigKey = 'tags';

		        if (!self.site) return; // todo: die kun je ophalen als eea. async is
		        data = data || self.extraData;
		        let result = {};
		        Object.keys(data).forEach((key) => {
		          let testRole = self.site.config && self.site.config[siteConfigKey] && self.site.config[siteConfigKey].extraData && self.site.config[siteConfigKey].extraData[key] && self.site.config[siteConfigKey].extraData[key].auth && self.site.config[siteConfigKey].extraData[key].auth[action+'ableBy'];
		          testRole = testRole || ( self.auth && self.auth[action+'ableBy'] );
		          if (userHasRole(user, testRole, self.userId)) {
		            result[key] = data[key];
		          }
		        });
		        return result;
		      },
		    }

		}

	}, {

		hooks: {
		},

		individualHooks: true,

	});

	Tag.scopes = function scopes() {

		return {

			defaultScope: {
			},

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

	Tag.associate = function( models ) {
		this.belongsToMany(models.Idea, { through: 'IdeaTags' });
	}

  // dit is hoe het momenteel werkt; ik denk niet dat dat de bedoeling is, maar ik volg nu
	Tag.auth = Tag.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: 'admin',
    updateableBy: 'admin',
    deleteableBy: 'admin',
  }

	return Tag;

}
