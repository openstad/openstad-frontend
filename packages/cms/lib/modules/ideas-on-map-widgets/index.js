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
      const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
      let imageProxy = siteUrl + '/image';

			widgets.forEach((widget) => {

			  let config = createConfig({
          widget: widget,
          data: req.data,
          apos: self.apos,
          jwt: req.session.jwt,
          apiUrl: self.apos.settings.getOption(req, 'apiUrl'),
          imageProxy,
          loginUrl: req.data.siteUrl + '/oauth/login?{returnTo}'
        });
			  widget.config = config;
        widget.divId = widget.config.divId;

        widget.openstadComponentsCdn = (req && req.data && req.data.global && req.data.global.openstadComponentsUrl) || self.apos.settings.getOption(req, 'siteConfig').openstadComponentsCdn;

        const containerId = self.apos.utils.generateId();
        widget.containerId = containerId;
        widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
        widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);

      });
      
			return superLoad(req, widgets, next);
			next();
		}

  }
};
