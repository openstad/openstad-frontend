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
      let apiUrl = self.apos.settings.getOption(req, 'apiUrl')

			widgets.forEach((widget) => {

			  let config = createConfig({
          widget: widget,
          data: req.data,
          logoutUrl: apiUrl + '/oauth/logout',
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
