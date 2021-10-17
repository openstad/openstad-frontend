/**
 * The openstad-basic-auth Module contains middleware that askes for basic authentication before anything else
 */

const auth              = require('basic-auth');
const compare           = require('tsscmp');

function unauthorized(req, res) {
  var challengeString = 'Basic realm=Openstad';
  res.set('WWW-Authenticate', challengeString);
  return res.status(401).send('Authentication required.');
}

module.exports = {
  construct: function (self, options) {

    /**
     * Basic auth check should be before anything else
     */

    self.expressMiddleware = {
      when: 'beforeRequired',
      middleware: (req, res, next) => {

        const siteConfig = self.apos.settings.getOption(req, 'siteConfig');

        let ignore_paths = ['/attachment-upload']; // TODO: configurable
        if (siteConfig.basicAuth && siteConfig.basicAuth.active && !ignore_paths.includes(req.path)) {
          var user = auth(req);

          if (!user || !compare(user.name, siteConfig.basicAuth.user) || ! compare(user.pass, siteConfig.basicAuth.password)) {
            return unauthorized(req, res);
          } else {
            return next();
          }

        } else {
          return next();
        }

      }
    }
  }
};
