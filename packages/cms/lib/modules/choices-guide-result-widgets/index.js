const merge = require('merge');

const { fields, arrangeFields } = require('./lib/fields');
const createConfig = require('./lib/create-config');

module.exports = {
  extend: 'openstad-components-widgets',
  label: 'Keuzewijzer resultaat',
  addFields: fields,
  beforeConstruct: function(self, options) {
    options.addFields = fields.concat(options.addFields || []);
  },
  playerData: ['config'],
  construct: function(self, options) {

    require('./lib/api')(self, options);

    // waarom is dit?
    self.expressMiddleware = {
      when: 'beforeRequired',
      middleware: (req, res, next) => {
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        self.apiUrl = apiUrl;
        const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
        self.siteId = siteConfig.id;
        next();
      }
    };

    const superPushAssets = self.pushAssets;
    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('script', 'main', {when: 'always'});
    };

    options.arrangeFields = (options.arrangeFields || []).concat( arrangeFields );

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

			widgets.forEach((widget) => {

        let apiUrl = self.apos.settings.getOption(req, 'apiUrl')
			  let config = createConfig({
          widget: widget,
          data: req.data,
          logoutUrl: apiUrl + '/oauth/logout',
        });
			  widget.config = merge.recursive(config, widget.config);

			});

			return superLoad(req, widgets, next);
			next();
		}

  }
};
