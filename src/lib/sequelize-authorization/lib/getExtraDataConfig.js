// TODO: verplaatsen; hoort niet in de generieke sequelize-authoriztion

const userHasRole = require('./hasRole');
var sanitize = require('../../../util/sanitize');


module.exports = function (dataTypeJSON,  siteConfigKey) {
  return {
    type: dataTypeJSON,
    allowNull: false,
    defaultValue: {},
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

      let oldValue =  this.getDataValue('extraData') || {};

      // new images replace old images
      if (value && value.images) {
        oldValue.images = [];
      }

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

          if (typeof val[key] === 'string') {
            val[key] = sanitize.safeTags(val[key]);
          }
        });
      }

      fillValue(oldValue, value);

      // ensure images is always an array
      if (value.images && typeof value.images === 'string') {
        value.images = [value.images];
      }

      this.setDataValue('extraData', value);
    },
    auth: {
      authorizeData: function(data, action, user, self, site) {
        if (!site) return; // todo: die kun je ophalen als eea. async is
        data = data || self.extraData;
        data = typeof data === 'object' ? data : {};
        let result = {};

        if (data) {
          Object.keys(data).forEach((key) => {

            let testRole = site.config && site.config[siteConfigKey] && site.config[siteConfigKey].extraData && site.config[siteConfigKey].extraData[key] && site.config[siteConfigKey].extraData[key].auth && site.config[siteConfigKey].extraData[key].auth[action+'ableBy'];
            testRole = testRole || ( self.auth && self.auth[action+'ableBy'] );

            if (Array.isArray(testRole) ? testRole.includes('detailsViewableByRole') : testRole == 'detailsViewableByRole') {
              if (self.detailsViewableByRole) {
                testRole = self.detailsViewableByRole;
              }
            }
            
            if (userHasRole(user, testRole, self.userId)) {
              result[key] = data[key];
            }
          });
        }

        return result;
      },
    }
  };
}
