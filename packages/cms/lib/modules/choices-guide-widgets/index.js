const styleSchema = require('../../../config/styleSchema.js').default;
const fs = require('fs');
const openstadComponentsUrl = process.env.OPENSTAD_COMPONENTS_URL || '/openstad-components';
const rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Keuzewijzer',
  addFields: [
		{
			name: 'choicesGuideId',
      type: 'integer',
			label: 'Id van de Keuzewijzer',
			required: true
		},
		{
			name: 'noOfQuestionsToShow',
      type: 'integer',
			label: 'Aantal vragen per pagina',
			required: true,
      def: 1,
		},
		{
			name: 'startWithAllQuestionsAnswered',
      type: 'boolean',
			label: 'Begin met alle vragen beantwoord op 50%',
			required: true,
      def: false,
		},
		{
			type: 'select',
			name: 'choicesType',
			label: 'Weergave van de voorkeuren',
			choices: [
				{
					label: 'Standaard',
					value: 'default',
				},
				{
					label: 'In een vlak',
					value: 'plane'
				}
			]
		},
		{
			name: 'beforeUrl',
      type: 'string',
			label: 'URL van de inleidende pagina',
			required: false,
		},
		{
			name: 'afterUrl',
      type: 'string',
			label: 'URL van de reultaat pagina',
			required: false,
		},
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
    };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

			widgets.forEach((widget) => {
			  widget.config = JSON.stringify({
          // req.data.isAdmin
          divId: 'choices-guide',
          siteId: req.data.global.siteId,
          api: {
            url: self.apos.settings.getOption(req, 'apiUrl'),
            headers: req.session.jwt ? { 'X-Authorization': 'Bearer ' + req.session.jwt } : {},
            isUserLoggedIn: req.data.loggedIn,
          },
          user: {
            role:  req.data.openstadUser && req.data.openstadUser.role,
            fullName:  req.data.openstadUser && (req.data.openstadUser.fullName || req.data.openstadUser.firstName + ' ' + req.data.openstadUser.lastName)
			    },
          choicesGuideId: widget.choicesGuideId,
          noOfQuestionsToShow: widget.noOfQuestionsToShow,
          choices: {
            type: widget.choicesType,
            startWithAllQuestionsAnswered: widget.startWithAllQuestionsAnswered,
            sticky: {
              offsetTop: 10,
            },
          },
          beforeUrl: widget.beforeUrl,
          afterUrl: widget.afterUrl,
        });
        widget.openstadComponentsUrl = openstadComponentsUrl;
        const containerId = styleSchema.generateId();
        widget.containerId = containerId;
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
