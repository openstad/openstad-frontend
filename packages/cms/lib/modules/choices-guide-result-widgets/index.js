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
  playerData: ['config', 'OpenStadComponentsCdn'],
  construct: function(self, options) {

    require('./lib/api')(self, options);

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
        widget.divId = widget.config.divId;
			});

			return superLoad(req, widgets, next);
			next();
		}

  }
};
