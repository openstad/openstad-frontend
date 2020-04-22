const styleSchema = require('../../../config/styleSchema.js').default;
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
			label: 'URL van de afsluitende pagina pagina',
			required: false,
		},
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();

/*
      self.pushAsset('stylesheet', 'default', { when: 'always' });
			self.pushAsset('stylesheet', 'accordeon', { when: 'always' });
      self.pushAsset('stylesheet', 'choice-plane', { when: 'always' });
      self.pushAsset('stylesheet', 'choices-guide', { when: 'always' });
      self.pushAsset('stylesheet', 'choices', { when: 'always' });
      self.pushAsset('stylesheet', 'form', { when: 'always' });
      self.pushAsset('stylesheet', 'question-group', { when: 'always' });
      self.pushAsset('stylesheet', 'questions', { when: 'always' });
      self.pushAsset('stylesheet', 'result', { when: 'always' });
*/

      //self.pushAsset('stylesheet', 'openstad-component', { when: 'always' });
			//self.pushAsset('script', 'openstad-component-choices-guide', { when: 'always' });
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
            sticky: {
              offsetTop: 10,
            },
          },
          beforeUrl: widget.beforeUrl,
          afterUrl: widget.afterUrl,
        });
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
