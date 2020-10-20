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
        next();
      }
    };

    self.route('get', 'refresh', function(req, res) {
      self.refreshSiteConfig();
      res.end(JSON.stringify({
        status: 'ok'
      }));

    }
  }
};
