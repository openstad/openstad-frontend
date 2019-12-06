module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Custom admin bar',
  afterConstruct: function (self) {
    self.pushAssets();
  },
  construct: function (self, options) {
    console.log('custom admin widgets');
    require('./lib/browser.js')(self, options);
    require('./lib/api.js')(self, options);
    require('./lib/routes.js')(self, options);
  }
};
