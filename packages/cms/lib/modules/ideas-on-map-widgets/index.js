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
  label: 'Kaart applicatie',
  addFields: fields.concat(styleSchemaDefinition),
  construct: function(self, options) {

    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['displayType', 'displayWidth', 'displayHeight', 'linkToCompleteUrl', 'ideaName', 'typeField', 'typesFilterLabel', 'startWithListOpenOnMobile']
      },
      {
        name: 'map',
        label: 'Kaart',
        fields: ['mapVariant', 'mapTilesUrl', 'mapTilesSubdomains', 'mapAutoZoomAndCenter', 'mapLocationIcon', 'mapClustering', 'mapMaxClusterRadius', 'canSelectLocation', 'onMarkerClickAction' ]
      },
      {
        name: 'content',
        label: 'Content',
        fields: ['noSelectionLoggedInHTML', 'noSelectionNotLoggedInHTML', 'noSelectionHTML', 'showNoSelectionOnMobile', 'selectionActiveLoggedInHTML', 'selectionInactiveLoggedInHTML', 'mobilePreviewLoggedInHTML', 'selectionActiveNotLoggedInHTML', 'selectionInactiveNotLoggedInHTML', 'mobilePreviewNotLoggedInHTML']
      },
      {
        name: 'sort',
        label: 'Sorteren',
        fields: ['selectedSorting', 'defaultSorting']
      },
      {
        name: 'idea-image',
        label: 'Idee afbeeldingen',
        fields: ['imageAllowMultipleImages', 'imageAspectRatio', 'imagePlaceholderImageSrc']
      },
      {
        name: 'idea-details',
        label: 'Idee details',
        fields: ['metaDataTemplate', 'linkToUserPageUrl', 'showShareButtons', 'shareChannelsSelection']
      },
      {
        name: 'filters',
        label: 'Filterbalk',
        fields: ['searchIn', 'searchPlaceHolder', 'searchAddresssesMunicipality']
      },
      {
        name: 'reactions',
        label: 'Reacties',
        fields: ['showReactions', 'reactionsTitle', 'reactionsPlaceholder', 'reactionsFormIntro', 'ignoreReactionsForIdeaIds', 'reactionsClosed', 'reactionsClosedText', 'closeReactionsForIdeaIds', ]
      },
      {
        name: 'idea-form',
        label: 'Idee formulier',
        fields: ['formUrl', 'formFields']
      },
    ]);

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
    };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

      const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
      let imageProxy = siteUrl + '/image';

			widgets.forEach((widget) => {

			  let config = createConfig(widget, req.data, req.session.jwt, self.apos.settings.getOption(req, 'apiUrl'), req.data.siteUrl + '/oauth/login?{returnTo}', imageProxy, self.apos );
			  widget.config = JSON.stringify(config);
        widget.openstadComponentsCdn = self.apos.settings.getOption(req, 'siteConfig').openstadComponentsCdn;

        const containerId = self.apos.utils.generateId();
        widget.containerId = containerId;
        widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
        widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);

      });
      
			return superLoad(req, widgets, next);
			next();
		}

    const superOutput = self.output;
    self.output = function(widget, options) {
      return superOutput(widget, options);
    };

  }
};
