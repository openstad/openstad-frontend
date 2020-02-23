module.exports = {
  alias: 'admin',
  label: 'Custom admin bar',
  afterConstruct: function (self) {
    self.pushAssets();
  },
  construct: function (self, options) {
    require('./lib/browser.js')(self, options);
    require('./lib/api.js')(self, options);
    require('./lib/routes.js')(self, options);

    self.addHelpers({
      renderAdminBarTemplate: () => {
        return self.partial('widget');
      }
    });
  }
};
