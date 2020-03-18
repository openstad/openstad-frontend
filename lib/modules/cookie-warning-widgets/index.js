/**
 * Module that renders the cookie warning
 *
 */
module.exports = {
  extend: 'apostrophe-widgets',
  alias: 'cookieWarning',
  label: 'Cookie warning',

  construct: function (self, options) {
    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
    };

    const superOutput = self.output;

    /**
     * Add the cookieConsent to the req.data object so it ca be used in widget templates for checking before loading
     */
    self.apos.app.use(function(req, res, next){
      req.data.cookieConsent = req.cookies && !!req.cookies.cookieConsent;
      next();
    })

    self.output = function(widget, options) {
      return superOutput(widget, options);
    };

    self.addHelpers({
      renderCookieWarning: () => {
        return self.partial('widget').val;
      }
    });
  }
};
