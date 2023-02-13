const { fields, arrangeFields } = require('./lib/fields');
const createConfig = require('./lib/create-config');

module.exports = {
  extend: 'openstad-components-widgets',
  label: 'Arguments',
  alias: 'arguments-block',
  adminOnly: true,
  addFields: fields,
  beforeConstruct: function(self, options) {
    options.addFields = fields.concat(options.addFields || []);
  },
  playerData: ['config', 'activeResourceId', 'OpenStadComponentsCdn'],
  construct: function(self, options) {

    const superPushAssets = self.pushAssets;
    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('script', 'main', {when: 'always'});
    };

    options.arrangeFields = (options.arrangeFields || []).concat( arrangeFields );

    const superLoad = self.load;
		self.load = function(req, widgets, next) {
			widgets.forEach((widget) => {
        const data = req.data;

			  let config = createConfig({
          widget: widget,
          data,
        });
			  widget.config = config;
        widget.divId = widget.config.divId;
        widget.isClosedButRoleAllowes= config.isClosed && (data.isAdmin || data.isEditor || data.isModerator);
      });
      
			return superLoad(req, widgets, next);
		}

    self.optionsPlayerData =  ['activeResourceId', 'activeResource'];
    const superFilterOptionsForDataAttribute = self.filterOptionsForDataAttribute;
    self.filterOptionsForDataAttribute = function(options) {
      options.activeResourceId = options.activeResource ?  options.activeResource.id : false;
      return superFilterOptionsForDataAttribute(options);
    };
  }
};
