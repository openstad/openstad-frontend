const rp = require('request-promise');
const internalApiUrl = process.env.INTERNAL_API_URL;

module.exports = {
  construct: function(self, options) {

    require('./lib/api.js')(self, options);
    require('./lib/routes.js')(self, options);

    self.expressMiddleware = {
      when: 'afterRequired',
      middleware: self.authenticate
    };

    // Todo: move this middleware to another module and also use the expressMiddleware instead of apos.app.use
    /**
     * When the user is admin, load in all the voting data
     * @type {[type]}
     */
    self.apos.app.use((req, res, next) => {
      if (req.data.hasModeratorRights) {
        const apiUrl = internalApiUrl ? internalApiUrl : self.apos.settings.getOption(req, 'apiUrl');
        const jwt = req.session.jwt;

        rp({
          uri: `${apiUrl}/api/site/${req.data.global.siteId}/vote`,
          headers: {
            'Accept': 'application/json',
            "X-Authorization" : `Bearer ${jwt}`,
            "Cache-Control": "no-cache"
          },
          json: true // Automatically parses the JSON string in the response
        })
          .then(function (votes) {
            req.data.votes = votes;
            return next();
          })
          .catch((e) => {
            return next();
          });

      } else {
        return next();
      }
    });
  }
};
