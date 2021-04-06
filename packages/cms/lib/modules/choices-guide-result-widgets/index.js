/**
 * Widget for displaying the result of a choice guide.
 *
 * The choice guide is a slightly complex user enquiry form, with certain results possible.
 * It's powered by a react application, currently in beta
 */
const styleSchema = require('../../../config/styleSchema.js').default;
const fs = require('fs');
const openstadComponentsUrl = process.env.OPENSTAD_COMPONENTS_URL || '/openstad-components';
const rp = require('request-promise');

const fields = require('./lib/fields');
const createConfig = require('./lib/create-config');

let styleSchemaDefinition = styleSchema.definition('containerStyles', 'Styles for the container');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Keuzewijzer resultaat',
  addFields: fields.concat(styleSchemaDefinition),
  construct: function(self, options) {

    require('./lib/api')(self, options);

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

    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['choicesGuideId', 'questionGroupId', 'choicesType', 'choicesPreferenceMinColor', 'choicesPreferenceMaxColor', 'choicesPreferenceTitle', 'choicesInBetweenPreferenceTitle', 'choicesMinLabel', 'choicesMaxLabel', 'choicesWithPercentage', 'startWithAllQuestionsAnswered', 'moreInfoUrl', 'moreInfoLabel', 'submissionType', ]
      },
      {
        name: 'form',
        label: 'Formulier',
        fields: ['formTitle', 'formIntro', 'formFields', 'beforeUrl', 'beforeLabel', 'afterUrl', 'afterLabel',]
      },
      {
        name: 'requiredLogin',
        label: 'Login',
        fields: ['requireLoginTitle', 'requireLoginDescription', 'requireLoginButtonTextLogin', 'requireLoginButtonTextLoggedIn', 'requireLoginButtonTextAlreadySubmitted', 'requireLoginChangeLoginLinkText', 'requireLoginLoggedInMessage', 'requireLoginNotYetLoggedInError', 'requireLoginAlreadySubmittedMessage',]
      },

    ]);

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
    };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

			widgets.forEach((widget) => {
        let apiUrl = self.apos.settings.getOption(req, 'apiUrl')
			  widget.config = JSON.stringify(createConfig(widget, req.data, req.session.jwt, apiUrl, req.data.siteUrl + '/oauth/login?returnTo=' + encodeURIComponent(req.url), apiUrl + '/oauth/logout' ));
        widget.openstadComponentsUrl = openstadComponentsUrl;
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
