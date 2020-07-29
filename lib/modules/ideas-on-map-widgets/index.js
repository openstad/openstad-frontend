const styleSchema = require('../../../config/styleSchema.js').default;
const fs = require('fs');
const openstadComponentsUrl = process.env.OPENSTAD_COMPONENTS_URL || '/openstad-components';
const imageApiUrl   = process.env.IMAGE_API_URL;
const imageApiToken = process.env.IMAGE_API_ACCESS_TOKEN;
const rp = require('request-promise');

module.exports = {
  extend: 'openstad-widgets',
  label: 'Kaart applicatie',
  addFields: [

    { 
      name: 'noSelectionHTML',
      type: 'string',
      label: 'noSelectionHTML',
      help: 'Er is geen punt of plan geselecteerd',
      textarea: true,
      required: false,
    },
    { 
      name: 'selectionActiveLoggedInHTML',
      type: 'string',
      label: 'selectionActiveLoggedInHTML',
      help: 'Ingelogd: er is een punt geselecteerd binnen de polygon, met een adres: {address} en {addButton}.',
      textarea: true,
      required: false,
    },
    { 
      name: 'selectionInactiveLoggedInHTML',
      type: 'string',
      label: 'selectionInactiveLoggedInHTML',
      help: 'Ingelogd: er is een punt geselecteerd buiten de polygon, met een {address}',
      textarea: true,
      required: false,
    },
    { 
      name: 'mobilePreviewLoggedInHTML',
      type: 'string',
      label: 'mobilePreviewLoggedInHTML',
      help: 'Ingelogd: er is een punt geselecteerd binnen de polygon, met een adres: {address} en {addButton}.',
      textarea: true,
      required: false,
    },
    { 
      name: 'selectionActiveNotLoggedInHTML',
      type: 'string',
      label: 'selectionActiveNotLoggedInHTML',
      help: 'Niet ingelogd: er is een punt geselecteerd binnen de polygon, met een adres: {address} en {loginButton} of <a href="{loginLink}">login link</a>.',
      textarea: true,
      required: false,
    },
    { 
      name: 'selectionInactiveNotLoggedInHTML',
      type: 'string',
      label: 'selectionInactiveNotLoggedInHTML',
      help: 'Niet ingelogd: er is een punt geselecteerd buiten de polygon, met een {address}',
      textarea: true,
      required: false,
    },
    { 
      name: 'mobilePreviewNotLoggedInHTML',
      type: 'string',
      label: 'mobilePreviewNotLoggedInHTML',
      help: 'Niet ingelogd: er is een punt geselecteerd binnen de polygon, met een adres: {address} en {loginButton} of <a href="{loginLink}">login link</a>.',
      textarea: true,
      required: false,
    },

    // doet ie nog niets mee maar zou wel een keer moeten
		// {
		//   name: 'typeField',
		//   type: 'string',
		//   label: 'Veld voor type inzending',
    //   def: 'extraData.theme',
		//   required: false
		// },

		{
			name: 'mapVariant',
			type: 'select',
			label: 'Variant',
      choices: [
        {
          label: 'NLMaps',
          value: '',
        },{
          label: 'Amsterdam',
          value: 'amaps',
        },
      ],
			required: false
		},
		{
			name: 'mapAutoZoomAndCenter',
			type: 'select',
			label: 'Zoom en center op',
      choices: [
        {
          label: 'Markers',
          value: 'markers',
        },{
          label: 'Polygon',
          value: 'polygon',
        },
      ],
			required: false
		},
    // zonder clusering werkt hij niet goed, dus die kun je nog niet uit zetten
		// {
		//   name: 'mapClustering',
		//   type: 'select',
		//   label: 'Clustering actief',
    //   choices: [
    //     {
    //       label: 'Ja',
    //       value: true,
		//   		showFields: [
		//   			'mapMaxClusterRadius'
		//   		]
    //     },{
    //       label: 'Nee',
    //       value: false,
    //     },
    //   ],
		//   required: false
		// },
    {
      name: 'mapMaxClusterRadius',
      type: 'integer',
      label: 'Gevoeligheid van clusering',
			def: 40
		},

		{
			type: 'select',
			name: 'showReactions',
			label: 'Toon reacties',
      def: true,
			choices: [
				{
					label: 'Ja',
					value: true,
          showFields: ['reactionsTitle', 'reactionsPlaceholder', 'reactionsFormIntro', 'ignoreReactionsForIdeaIds'],
				},
				{
					label: 'Nee',
					value: false
				},
			]
		},

		{
			name: 'reactionsTitle',
			type: 'string',
			label: 'Titel boven reaties',
			required: false
		},

		{
			name: 'reactionsFormIntro',
			type: 'string',
			label: 'Tekst boven reaactie invoerveld',
			required: false
		},

		{
			name: 'reactionsPlaceholder',
			type: 'string',
			label: 'Tekst in leeg reactie invoerveld',
			required: false
		},

		{
			name: 'ignoreReactionsForIdeaIds',
			type: 'string',
			label: 'Ids van Ideas waarvoor reacties niet actief zijn',
			required: false
		},

    // ----------------------------------------------------------------------------------------------------
    // dit komt uit user-form en moet daarmee gelijk getrokken als dat echt werkt
    // {
    //   type:  'string',
    //   name:  'formTitle',
    //   label: 'Title',
    // },
    // {
    //   type:     'string',
    //   name:     'formIntro',
    //   label:    'Intro',
    //   textarea: true
    // },
    {
      name:       'formFields',
      label:      'Form fields',
      type:       'array',
      titleField: 'title',
      required:   true,
      schema:     [
        {
          type:  'string',
          name:  'name',
          label: 'Name'
        },
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
              value: 'text-with-counter',
            },
            {
              label: 'Textarea',
              value: 'textarea-with-counter',
            },
            {
              label: 'HTML',
              value: 'html-with-counter',
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
        fields: ['typeField']
      },
      {
        name: 'map',
        label: 'Kaart',
        fields: ['mapVariant', 'mapAutoZoomAndCenter', 'mapClustering', 'mapMaxClusterRadius', ]
      },
      {
        name: 'content',
        label: 'Content',
        fields: ['noSelectionHTML', 'selectionActiveLoggedInHTML', 'selectionInactiveLoggedInHTML', 'mobilePreviewLoggedInHTML', 'selectionActiveNotLoggedInHTML', 'selectionInactiveNotLoggedInHTML', 'mobilePreviewNotLoggedInHTML']
      },
      {
        name: 'reactions',
        label: 'Reacties',
        fields: ['showReactions', 'reactionsTitle', 'reactionsPlaceholder', 'reactionsFormIntro', 'ignoreReactionsForIdeaIds', ]
      },
      {
        name: 'form',
        label: 'Formulier',
        fields: ['formFields', 'beforeUrl', 'beforeLabel', 'afterUrl', 'afterLabel',]
      },
    ]);

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
			// self.pushAsset('stylesheet', 'openstad-component-ideas-on-map', { when: 'always' });

      // This include makes our whole javascript file huge, better to load only for this application
			//self.pushAsset('script', 'openstad-component-ideas-on-map', { when: 'always' });
    };

    // <link rel="stylesheet" type="text/css" href="dist/css/default.css"/>
	  // <script src="dist/index.js"></script>

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

      let types;
      try {
        types = req.data.global.themes || [];
        types = types.map(type => { return {
          name: type.value,
          color: type.color,
          mapicon: JSON.parse(type.mapicon),
          listicon: JSON.parse(type.listicon || '{}'),
        }})
      } catch (err) {
      }

			widgets.forEach((widget) => {

        let contentConfig = {};
        if (widget.noSelectionHTML) contentConfig.noSelectionHTML = widget.noSelectionHTML;
        if (widget.selectionActiveLoggedInHTML) contentConfig.selectionActiveLoggedInHTML = widget.selectionActiveLoggedInHTML;
        if (widget.selectionInactiveLoggedInHTML) contentConfig.selectionInactiveLoggedInHTML = widget.selectionInactiveLoggedInHTML;
        if (widget.mobilePreviewLoggedInHTML) contentConfig.mobilePreviewLoggedInHTML = widget.mobilePreviewLoggedInHTML;
        if (widget.selectionActiveNotLoggedInHTML) contentConfig.selectionActiveNotLoggedInHTML = widget.selectionActiveNotLoggedInHTML;
        if (widget.selectionInactiveNotLoggedInHTML) contentConfig.selectionInactiveNotLoggedInHTML = widget.selectionInactiveNotLoggedInHTML;
        if (widget.mobilePreviewNotLoggedInHTML) contentConfig.mobilePreviewNotLoggedInHTML = widget.mobilePreviewNotLoggedInHTML;
        
			  widget.config = JSON.stringify({
          // req.data.isAdmin
          divId: 'ideeen-op-de-kaart',
          siteId: req.data.global.siteId,
          api: {
            url: self.apos.settings.getOption(req, 'apiUrl'),
            headers: req.session.jwt ? { 'X-Authorization': 'Bearer ' + req.session.jwt } : [],
            isUserLoggedIn: req.data.loggedIn,
          },
          content: contentConfig,
          user: {
            role:  req.data.openstadUser && req.data.openstadUser.role,
            fullName:  req.data.openstadUser && (req.data.openstadUser.fullName || req.data.openstadUser.firstName + ' ' + req.data.openstadUser.lastName)
          },
          types,
			    idea: {
            showVoteButtons: req.data.global.siteConfig && req.data.global.siteConfig.ideas && typeof req.data.global.siteConfig.ideas.showVoteButtons != 'undefined' ? req.data.global.siteConfig.ideas.showVoteButtons : true,
            canAddNewIdeas: req.data.global.siteConfig && req.data.global.siteConfig.ideas && typeof req.data.global.siteConfig.ideas.canAddNewIdeas != 'undefined' ? req.data.global.siteConfig.ideas.canAddNewIdeas : true,
				    titleMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.titleMinLength ) || 30,
				    titleMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.titleMaxLength ) || 200,
				    summaryMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.summaryMinLength ) || 30,
				    summaryMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.summaryMaxLength ) || 200,
				    descriptionMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.descriptionMinLength ) || 30,
				    descriptionMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.descriptionMaxLength ) || 200,
            imageserver: {
              // TODO: hij staat nu zonder /image in de .env van de frontend, maar daar zou natuurlijk de hele url moeten staan
				      process: '/image',
				      fetch: '/image',
            },
            fields: widget.formFields,
			    },
			    argument: {
            isActive: widget.showReactions,
            title: widget.reactionsTitle,
            formIntro: widget.reactionsFormIntro,
            placeholder: widget.reactionsPlaceholder,
				    descriptionMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.arguments && req.data.global.siteConfig.arguments.descriptionMinLength ) || 30,
				    descriptionMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.arguments && req.data.global.siteConfig.arguments.descriptionMaxLength ) || 100,
			    },
			    map: {
            variant: widget.mapVariant,
            zoom: 16,
            clustering: {
              isActive: true, // widget.mapClustering,
              maxClusterRadius: widget.mapMaxClusterRadius,
            },
            autoZoomAndCenter: widget.mapAutoZoomAndCenter,
            polygon: ( req.data.global.siteConfig && req.data.global.siteConfig.openstadMap && req.data.global.siteConfig.openstadMap.polygon ) || undefined,
            showCoverageOnHover: false,
			    },
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
