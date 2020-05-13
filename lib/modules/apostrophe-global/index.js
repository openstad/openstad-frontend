const auth              = require('basic-auth')
const compare           = require('tsscmp')
const fields            = require('./lib/fields');
const arrangeFields     = require('./lib/arrangeFields');

function unauthorized(req, res) {
    var challengeString = 'Basic realm=Openstad';
    res.set('WWW-Authenticate', challengeString);
    return res.status(401).send('Authentication required.');
}

module.exports = {
  addFields: fields,
  afterConstruct: function(self) {

    self.expressMiddleware.push(self.overrideGlobalDataWithSiteConfig);
  },
  construct: function (self, options) {

    require('./lib/api')(self, options);

    self.on('apostrophe:modulesReady', 'setSyncFields');
    self.on('apostrophe-docs:afterSave', 'syncApi');

    options.arrangeFields = (options.arrangeFields || []).concat(arrangeFields);

    // Todo: what is this middleware and why is it in this module?
    self.apos.app.use((req, res, next) => {
      const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
      if (siteConfig.basicAuth && siteConfig.basicAuth.active) {
        var user = auth(req);

        if (!user || !compare(user.name, siteConfig.basicAuth.user) || ! compare(user.pass, siteConfig.basicAuth.password)) {
          unauthorized(req, res);
        } else {
          next();
        }

      } else {
        next();
      }
    });

  }
};

/**
 *
 *
 *
@TODO arrangeFields
 // Separate the palette field names so we can group them in a tab
var fieldNames = _.map(options.paletteFields, function (field) {
  return field.name
});


 *
 */
