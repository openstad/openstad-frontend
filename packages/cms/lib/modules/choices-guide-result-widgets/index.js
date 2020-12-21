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

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Keuzewijzer resultaat',
  addFields: [
		{
			name: 'choicesGuideId',
      type: 'integer',
			label: 'Id van de Keuzewijzer',
			required: true
		},
		{
			name: 'questionGroupId',
      type: 'integer',
			label: 'Id van de vragen groep',
			required: true,
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
					label: 'Van min naar plus 100',
					value: 'minus-to-plus-100',
          showFields: ['choicesPreferenceMinColor', 'choicesPreferenceMaxColor']
				},
				{
					label: 'In een vlak',
					value: 'plane'
				}
			]
		},
    {
      type:     'string',
      name:     'choicesPreferenceMinColor',
      label:    'Kleur van de balken, minimaal',
      help:     'Dit moet (nu nog) in het formaat #123456',
      def:      '#ff9100',
    },
    {
      type:     'string',
      name:     'choicesPreferenceMaxColor',
      label:    'Kleur van de balken, maximaal',
      help:     'Dit moet (nu nog) in het formaat #123456',
      def:      '#bed200',
    },
    {
      type:     'string',
      name:     'choicesPreferenceTitle',
      label:    'Titel boven de keuzes, met voorkeur',
      help:     'Bijvoorbeeld "Jouw voorkeur is {preferredChoice}"',
      def:      'Jouw voorkeur is {preferredChoice}',
    },
    {
      type:     'string',
      name:     'choicesNoPreferenceYetTitle',
      label:    'Titel boven de keuzes, nog geen voorkeur',
      help:     'Bijvoorbeeld "Je hebt nog geen keuze gemaakt"',
      def:      'Je hebt nog geen keuze gemaakt',
    },
		{
			type: 'select',
			name: 'submissionType',
			label: 'Opsturen van resultaten',
      def: 'none',
			choices: [
				{
					label: 'Niet',
					value: 'none',
				},
				{
					label: 'Automatisch',
					value: 'auto'
				},
				{
					label: 'Een formulier met extra gegevens',
					value: 'form',
					showTab: [
						'Form'
					]
				}
			]
		},

		{
			name: 'moreInfoUrl',
      type: 'string',
			label: 'Url achter de \'meer info\' link',
		},
		{
			name: 'moreInfoLabel',
      type: 'string',
			label: 'Tekst op de \'meer info\' link',
		},

		{
			name: 'beforeUrl',
      type: 'string',
			label: 'Url achter de \'vorige\' knop',
		},
		{
			name: 'beforeLabel',
      type: 'string',
			label: 'Tekst op de \'vorige\' knop',
		},
		{
			name: 'afterUrl',
      type: 'string',
			label: 'Url achter de \'volgende\' knop',
		},
		{
			name: 'afterLabel',
      type: 'string',
			label: 'Tekst op de \'volgende\' knop',
		},

    // ----------------------------------------------------------------------------------------------------
    // dit komt uit user-form en moet daarmee gelijk getrokken als dat echt werkt
    {
      type:  'string',
      name:  'formTitle',
      label: 'Title',
    },
    {
      type:     'string',
      name:     'formIntro',
      label:    'Intro',
      textarea: true
    },
    {
      name:       'formFields',
      label:      'Form fields',
      type:       'array',
      titleField: 'title',
      schema:     [
        {
          type:  'string',
          name:  'title',
          label: 'Title'
        },
        {
          type:     'string',
          name:     'description',
          label:    'Beschrijving',
          textarea: true
        },
        {
          name:    'inputType',
          label:   'Type veld',
          type:    'select',
          choices: [
            {
              label: 'Multiple choice',
              value: 'multiple-choice',
            },
            {
              label: 'Select',
              value: 'select',
            },
            {
              label: 'Text',
              value: 'text',
            },
            {
              label: 'Textarea',
              value: 'textarea',
            },
            {
              label: 'Postcode',
              value: 'postcode',
            },
            {
              label: 'Image upload',
              value: 'image-upload',
            },
            {
              label: 'Locatie picker',
              value: 'location-picker',
            }
          ]
        },
        {
          name:       'choices',
          label:      'Keuzes (enkel voor multiple choice of select)',
          type:       'array',
          titleField: 'title',
          schema:     [
            {
              name:     'image',
              type:     'attachment',
              label:    'Icon',
              required: false,
              trash:    true
            },
            {
              type:  'string',
              name:  'title',
              label: 'Titel'
            },
            {
              type:  'string',
              name:  'value',
              label: 'Waarde'
            }
          ]
        },
		    {
			    type: 'select',
			    name: 'required',
			    label: 'Is verplicht',
          def: 'none',
			    choices: [
				    {
					    label: 'Ja',
					    value: true,
				    },
				    {
					    label: 'Nee',
					    value: false
				    },
			    ]
		    },
      ]
    },
    // einde uit user-form
    // ----------------------------------------------------------------------------------------------------

    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['choicesGuideId', 'questionGroupId', 'choicesType', 'choicesPreferenceMinColor', 'choicesPreferenceMaxColor', 'choicesPreferenceTitle', 'choicesNoPreferenceYetTitle', 'moreInfoUrl', 'moreInfoLabel', 'submissionType', ]
      },
      {
        name: 'form',
        label: 'Formulier',
        fields: ['formTitle', 'formIntro', 'formFields', 'beforeUrl', 'beforeLabel', 'afterUrl', 'afterLabel',]
      },

      /*  {
        name: 'text',
        label: 'Text',
        fields: ['text_', 'text_', 'text_' ]
      },*/
    ]);


    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
    };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

			widgets.forEach((widget) => {
			  widget.config = JSON.stringify({
          // req.data.isAdmin
          divId: 'choices-guide-result',
          siteId: req.data.global.siteId,
          api: {
            url: self.apos.settings.getOption(req, 'apiUrl'),
            headers: req.session.jwt ? { 'X-Authorization': 'Bearer ' + req.session.jwt } : {},
            isUserLoggedIn: req.data.loggedIn,
          },
          choicesGuideId: widget.choicesGuideId,
          questionGroupId: widget.questionGroupId,
          choices: {
            type: widget.choicesType,
            title: {
              preference: widget.choicesPreferenceTitle,
              noPreferenceYet: widget.choicesNoPreferenceYetTitle,
            },
            barColor: { min: widget.choicesPreferenceMinColor || null, max: widget.choicesPreferenceMaxColor || null },
          },
          moreInfoUrl: widget.moreInfoUrl,
          moreInfoLabel: widget.moreInfoLabel,
          beforeUrl: widget.beforeUrl,
          beforeLabel: widget.beforeLabel,
          afterUrl: widget.afterUrl,
          afterLabel: widget.afterLabel,
          submission: {
            type: widget.submissionType,
            form: {
              title: widget.formTitle,
              intro: widget.formIntro,
              fields: widget.formFields,
            },
          },
          preferenceTitle: widget.preferenceTitle,
        });
        widget.openstadComponentsUrl = openstadComponentsUrl;
        const containerId = widget._id;
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
