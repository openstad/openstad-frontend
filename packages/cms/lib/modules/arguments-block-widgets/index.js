const styleSchema = require('../../../config/styleSchema.js').default;
const fs = require('fs');
const imageApiUrl   = process.env.IMAGE_API_URL;
const imageApiToken = process.env.IMAGE_API_ACCESS_TOKEN;
const rp = require('request-promise');

const fields = require('./lib/fields');
const createConfig = require('./lib/create-config');

let styleSchemaDefinition = styleSchema.definition('containerStyles', 'Styles for the container');

module.exports = {
  extend: 'openstad-widgets',
  label: 'Arguments',
  alias: 'arguments-block',
  adminOnly: true,
  addFields: fields.concat(styleSchemaDefinition),
  construct: function(self, options) {

    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['sentiment', 'isReplyingEnabled', 'isVotingEnabled']
      },
      {
        name: 'list',
        label: 'Lijst',
        fields: ['title', 'emptyListText']
      },
      {
        name: 'form',
        label: 'Formulier',
        fields: ['formIntro', 'placeholder']
      },
    ]);

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
    };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

      const siteUrl = self.apos.settings.getOption(req, 'siteUrl');

			widgets.forEach((widget) => {

        widget.config = createConfig(widget, req.data, req.session.jwt, self.apos.settings.getOption(req, 'apiUrl'), req.data.siteUrl + '/oauth/login?{returnTo}' ); // stringfy in .output
        widget.openstadComponentsCdn = self.apos.settings.getOption(req, 'siteConfig').openstadComponentsCdn;

        const containerId = self.apos.utils.generateId();
        widget.containerId = containerId;
        widget.divId = widget.config.divId;
        widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
        widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);

      });
      
			return superLoad(req, widgets, next);
			next();
		}

    const superOutput = self.output;
    self.output = function(widget, options) {
      widget.config.ideaId =  options.activeResource ?  options.activeResource.id : false;
			widget.config = JSON.stringify(widget.config); 
      return superOutput(widget, options);
    };

  }
};
