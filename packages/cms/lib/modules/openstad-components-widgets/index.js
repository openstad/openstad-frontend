const styleSchema = require('../../../config/styleSchema.js').default;
const fs = require('fs');
const imageApiUrl   = process.env.IMAGE_API_URL;
const imageApiToken = process.env.IMAGE_API_ACCESS_TOKEN;
const rp = require('request-promise');
const merge = require('merge');

const { fields, arrangeFields } = require('./lib/fields');
const createConfig = require('./lib/create-config');

let styleSchemaDefinition = styleSchema.definition('containerStyles', 'Styles for the container');

module.exports = {
  extend: 'openstad-widgets',
  label: 'OpenStad componenys Base widget',
  addFields: fields.concat(styleSchemaDefinition),
  beforeConstruct: function(self, options) {
    options.addFields = fields.concat(options.addFields || []);
  },
  construct: function(self, options) {

    options.arrangeFields = (options.arrangeFields || []).concat( arrangeFields );

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

      const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
      let imageProxy = siteUrl + '/image';

			widgets.forEach((widget) => {

			  let config = createConfig({
          widget: widget,
          data: req.data,
          jwt: req.session.jwt,
          apiUrl: self.apos.settings.getOption(req, 'apiUrl'),
          loginUrl: req.data.siteUrl + '/oauth/login?{returnTo}',
          imageProxy: imageProxy,
          apos: self.apos,
        });
			  widget.config = merge.recursive(config, widget.config);

			  widget.config = JSON.stringify(config);
        widget.openstadComponentsCdn = self.apos.settings.getOption(req, 'siteConfig').openstadComponentsCdn;

        const containerId = self.apos.utils.generateId();
        widget.containerId = containerId;
        widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
        widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);

      });
      
			return superLoad(req, widgets, next);
		}

    const superOutput = self.output;
    self.output = function(widget, options) {
      return superOutput(widget, options);
    };

  }
};
