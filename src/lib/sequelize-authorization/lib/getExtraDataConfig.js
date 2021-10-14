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
      if (value && value.images && typeof value.images === 'string') {
        value.images = [value.images];
      }

      this.setDataValue('extraData', value);
    },
    auth: {
      viewableBy: 'all',
      authorizeData: function(data, action, user, self, site) {

        if (!site) return; // todo: die kun je ophalen als eea. async is
        data = data || self.extraData;
        data = typeof data === 'object' ? data : {};
        let result = {};

        let userId = self.userId;
        if (self.toString().match('SequelizeInstance:user')) { // TODO: find a better check
          userId = self.id
        }

        if (data) {
          Object.keys(data).forEach((key) => {

            let testRole = site.config && site.config[siteConfigKey] && site.config[siteConfigKey].extraData && site.config[siteConfigKey].extraData[key] && site.config[siteConfigKey].extraData[key].auth && site.config[siteConfigKey].extraData[key].auth[action+'ableBy'];
            testRole = testRole || self.rawAttributes.extraData.auth[action+'ableBy'];
            testRole = testRole || ( self.auth && self.auth[action+'ableBy'] ) || [];
            if (!Array.isArray(testRole)) testRole = [testRole];

            if (testRole.includes('detailsViewableByRole')) {
              if (self.detailsViewableByRole) {
                testRole = [ self.detailsViewableByRole, 'owner' ];
              }
            }

            if (userHasRole(user, testRole, userId)) {
              result[key] = data[key];
            }
          });
        }

        return result;
      },
    }
  };
}
