/**
 * Module that renders the cookie warning
 *
 */
module.exports = {
  extend: 'apostrophe-widgets',
  alias: 'cookieWarning',
  label: 'Cookie warning',
  addFields: [
      {
          name: 'statusText',
          type: 'string',
          label: 'Status text',
          help: 'E.g. Uw voorkeur:'
      },
      {
          name: 'statusAllowText',
          type: 'string',
          label: 'Status text when cookies are allowed',
          help: 'E.g. Cookies toegestaan.'
      },
      {
          name: 'statusDenyText',
          type: 'string',
          label: 'Status text when cookies are denied',
          help: 'E.g. Cookies geweigerd.'
      },
      {
          name: 'description',
          type: 'string',
          label: 'Description',
          textarea: true,
          help: 'E.g. Pas hier uw voorkeur aan:'
      },
      {
          name: 'buttonAllowText',
          type: 'string',
          label: 'Button allow text',
          help: 'E.g. Cookies van derden toestaan'
      },
      {
          name: 'buttonDenyText',
          type: 'string',
          label: 'Button allow text',
          help: 'E.g. Cookies van derden weigeren'
      },

  ],
  construct: function (self, options) {

    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
      self.pushAsset('script', 'main', { when: 'always' });
    };

    const superOutput = self.output;

    /**
     * Add the cookieConsent to the req.data object so it ca be used in widget templates for checking before loading
     */
    self.apos.app.use(function(req, res, next){
        req.data.cookieConsent = req.data.global.useCookieWarning ? req.cookies && req.cookies['cookie-consent'] == 1 : true;
        next();
    });

    const superLoad = self.load;
    self.load = function(req, widgets, next) {
      widgets.forEach((widget) => {
          widget.statusText = widget.statusText || 'Uw voorkeur:';
          widget.statusAllowText = widget.statusAllowText || 'Cookies toegestaan.';
          widget.statusDenyText = widget.statusDenyText || 'Cookies geweigerd.';
          widget.description = widget.description || 'Pas hier uw voorkeur aan:';
          widget.buttonAllowText = widget.buttonAllowText || 'Cookies van derden toestaan';
          widget.buttonDenyText = widget.buttonAllowText || 'Cookies van derden weigeren';
      });

        superLoad(req, widgets, next);
    };

    self.output = function(widget, options) {
      return superOutput(widget, options);
    };

    self.addHelpers({
      renderCookieWarning: () => {
        return self.partial('cookie-bar');
      }
    });
  }
};
