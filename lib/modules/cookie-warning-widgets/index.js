module.exports = {
  extend: 'apostrophe-widgets',
  alias: 'cookieWarning',
  label: 'Cookie warning',
  afterConstruct: function (self) {
    self.pushAssets();
  },
  construct: function (self, options) {

    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
      //self.pushAsset('script', 'main', { when: 'always' });
      
    };
    
    const superLoad = self.load;
    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
        const containerId = styleSchema.generateId();
        widget.cookiePageLink = 'about-cookies-link';
        widget.cookieConsent = 'todo';
        // widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
      });
      return superLoad(req, widgets, callback);
    }
    
    self.addHelpers({
      renderCookieWarning: () => {
        return self.partial('widget').val;
      }
    });

    // default cookies page
    self.apos.app.use('/about-cookies', (req, res, next) => {
      // dit rendered de layout
      // return self.sendPage(req, self.renderer('layout'), { 'maar-hoe-krijg-ik-dit-er-in': self.render(req, 'default-cookies-page') });
      // dit rendered de cookies pagina
      // return res.send(self.render(req, 'default-cookies-page', { cookieConsent: req.cookies['cookie-consent'] }));
      // dit doet dat ook
      self.sendPage(req, self.renderer('default-cookies-page'), { cookieConsent: req.cookies['cookie-consent'] });
      // maar hoe ik die twee in elkaar vlecht is me nog niet duidelijk
   });

  }
};
