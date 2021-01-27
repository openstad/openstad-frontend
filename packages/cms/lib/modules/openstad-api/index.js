/**
 * Module is responsible for syncing values from global to the API Settings
 * Notably the CSS and logo settings are synched with the API and Auth server
 */
module.exports = {
  name: 'openstad-api',
  alias: 'openstadApi',
  construct(self, options) {

    require('./lib/helpers.js')(self, options);
    require('./lib/config.js')(self, options);
    require('./lib/api.js')(self, options);

    self.expressMiddleware = {
      when: 'afterRequired',
      middleware: (req, res, next) => {
        self.init(req);
        const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
        req.data.siteUrl = siteUrl;
        next();
      }
    };

    self.route('get', 'refresh', function(req, res) {
      self.refreshSiteConfig();
      res.end(JSON.stringify({
        status: 'ok'
      }));
    })
  }
};
