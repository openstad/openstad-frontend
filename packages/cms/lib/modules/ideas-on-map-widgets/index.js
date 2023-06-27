const { fields, arrangeFields } = require('./lib/fields');
const createConfig = require('./lib/create-config');

module.exports = {
  extend: 'openstad-components-widgets',
  label: 'Kaart applicatie',
  addFields: fields,
  beforeConstruct: function(self, options) {
    options.addFields = fields.concat(options.addFields || []);
  },
  playerData: ['config', 'OpenStadComponentsCdn'],
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

			  let config = createConfig(widget, req.data, req.session.jwt, self.apos.settings.getOption(req, 'apiUrl'), req.data.siteUrl + '/oauth/login?{returnTo}', imageProxy, self.apos );
			  widget.config = JSON.stringify(config);
        widget.openstadComponentsCdn = (req && req.data && req.data.global && req.data.global.openstadComponentsUrl) || self.apos.settings.getOption(req, 'siteConfig').openstadComponentsCdn;;

        const containerId = self.apos.utils.generateId();
        widget.containerId = containerId;
        widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
        widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
        widget.divId = widget.config.divId;

      });
      
			return superLoad(req, widgets, next);
		}

  }
};
