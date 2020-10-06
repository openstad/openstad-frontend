const styleSchema = require('../../../config/styleSchema.js').default;
const sortingOptions  = require('../../../config/sorting.js').ideasOnMapOptions;
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
			type: 'select',
			name: 'displayType',
			label: 'Weergave',
			choices: [
				{
					label: 'Simpel',
					value: 'simple',
					showFields: [
						'displayWidth',
						'displayHeight',
						'linkToCompleteUrl'
					]
				},
				{
					label: 'Volledig',
					value: 'complete',
					showFields: [
            'ideaName', 'typeLabel', 'typesFilterLabel', 'startWithListOpenOnMobile'
					]
				}
			],
      def: 'complete',
		},
    {
      name: 'displayWidth',
      type: 'string',
      label: 'Width',
		},
    {
      name: 'displayHeight',
      type: 'string',
      label: 'Height',
		},

    {
      name: 'linkToCompleteUrl',
      type: 'string',
      label: 'Link naar',
		},

    {
      name: 'linkToUserPageUrl',
      type: 'string',
      label: 'Link naar gebruikers pagina',
		},

		{
			type: 'select',
			name: 'startWithListOpenOnMobile',
			label: 'Op mobiel opent de lijst van ideeen over de kaart',
      def: false,
			choices: [
				{
					label: 'Nee',
					value: false
				},
				{
					label: 'Ja',
					value: true,
				},
			]
		},

		{
			type: 'select',
			name: 'canSelectLocation',
			label: 'Op de kaart klikken selecteert een locatie',
      def: true,
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
    
    { 
      name: 'noSelectionLoggedInHTML',
      type: 'string',
      label: 'noSelectionLoggedInHTML',
      help: 'Er is geen punt of plan geselecteerd, met een {loginButton}.',
      textarea: true,
      required: false,
    },
    { 
      name: 'noSelectionNotLoggedInHTML',
      type: 'string',
      label: 'noSelectionNotLoggedInHTML',
      help: 'Er is geen punt of plan geselecteerd, met een {addButton}.',
      textarea: true,
      required: false,
    },

		{
			type: 'select',
			name: 'showNoSelectionOnMobile',
			label: 'Toon het noSelection blok op mobiel',
      def: false,
			choices: [
				{
					label: 'Nee',
					value: false
				},
				{
					label: 'Ja',
					value: true,
				},
			]
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
			name: 'ideaName',
			type: 'string',
			label: 'Naam voor idea',
			def: 'Inzending',
			required: false
		},
		{
			name: 'typeField',
			type: 'string',
			label: 'Veld voor type inzending',
			def: 'extraData.theme',
			required: false
		},
		{
			name: 'typeLabel',
			type: 'string',
			label: 'Label voor type in detail pagina',
			def: 'Thema',
			required: false
		},
		{
			name: 'typesFilterLabel',
			type: 'string',
			label: 'Label voor type in filters',
			def: 'Alle thema\'s',
			required: false
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

		{
			name: 'closeReactionsForIdeaIds',
			type: 'string',
			label: 'Ids van Ideas waarvoor reacties gesloten zijn',
			required: false
		},

    {
      type: 'checkboxes',
      name: 'selectedSorting',
      label: 'Select sorting available',
      choices: sortingOptions
    },
    {
      type: 'select',
      name: 'defaultSorting',
      label: 'Select the default sorting',
      choices: sortingOptions
    },

    {
      name: 'showShareButtons',
      type: 'boolean',
      label: 'Display share buttons?',
      choices: [
        {
          value: true,
          label: "Yes",
          showFields: ['shareChannelsSelection']
        },
        {
          value: false,
          label: "No"
        },
      ],
      def: true
    },
    {
      name: 'shareChannelsSelection',
      type: 'checkboxes',
      label: 'Select which share buttons you want to display (if left empty all social buttons will be shown)',
      choices: [
        {
          value: 'facebook',
          label: "Facebook"
        },
        {
          value: 'twitter',
          label: "Twitter"
        },
        {
          value: 'mail',
          label: "E-mail"
        },
        {
          value: 'whatsapp',
          label: "Whatsapp"
        },
      ]
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
			type:	 'string',
			name:	 'formUrl',
      help:  'dit overschrijft de onderstaande formulier definitie',
			label: 'Form Url',
		},
    // TODO: dit is al de zovelste kopie en moet dus naar een lib
    {
      name:       'formFields',
      label:      'Form fields',
      type:       'array',
      titleField: 'title',
      schema:     [
        {
          type:  'string',
          name:  'name',
          label: 'Name of the database field',
			    required: true,
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
              label: 'Radio buttons',
              value: 'radios',
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
        fields: ['displayType', 'displayWidth', 'displayHeight', 'linkToCompleteUrl', 'ideaName', 'typeField', 'typeLabel', 'typesFilterLabel', 'startWithListOpenOnMobile']
      },
      {
        name: 'map',
        label: 'Kaart',
        fields: ['mapVariant', 'mapAutoZoomAndCenter', 'mapClustering', 'mapMaxClusterRadius', 'canSelectLocation' ]
      },
      {
        name: 'content',
        label: 'Content',
        fields: ['linkToUserPageUrl', 'noSelectionLoggedInHTML', 'noSelectionNotLoggedInHTML', 'showNoSelectionOnMobile', 'selectionActiveLoggedInHTML', 'selectionInactiveLoggedInHTML', 'mobilePreviewLoggedInHTML', 'selectionActiveNotLoggedInHTML', 'selectionInactiveNotLoggedInHTML', 'mobilePreviewNotLoggedInHTML']
      },
      {
        name: 'sort',
        label: 'Sorteren',
        fields: ['selectedSorting', 'defaultSorting']
      },
      {
        name: 'idea-details',
        label: 'Idee details',
        fields: ['showShareButtons', 'shareChannelsSelection']
      },
      {
        name: 'reactions',
        label: 'Reacties',
        fields: ['showReactions', 'reactionsTitle', 'reactionsPlaceholder', 'reactionsFormIntro', 'ignoreReactionsForIdeaIds', 'closeReactionsForIdeaIds', ]
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
			// self.pushAsset('stylesheet', 'openstad-component-ideas-on-map', { when: 'always' });

      // This include makes our whole javascript file huge, better to load only for this application
			//self.pushAsset('script', 'openstad-component-ideas-on-map', { when: 'always' });
    };

    // <link rel="stylesheet" type="text/css" href="dist/css/default.css"/>
	  // <script src="dist/index.js"></script>

    const superLoad = self.load;
		self.load = function(req, widgets, next) {


      let ideaTypes = req.data.global.siteConfig && req.data.global.siteConfig.ideas && typeof req.data.global.siteConfig.ideas.types != 'undefined' ? req.data.global.siteConfig.ideas.types : undefined;
      let themeTypes;
      try {
        themeTypes = req.data.global.themes || [];
        themeTypes = themeTypes.map(type => { return {
          name: type.value,
          color: type.color,
          mapicon: JSON.parse(type.mapicon),
          listicon: JSON.parse(type.listicon || '{}'),
        }})
      } catch (err) {
      }

      
			widgets.forEach((widget) => {

        let contentConfig = {
          ignoreReactionsForIdeaIds: widget.ignoreReactionsForIdeaIds,
        };
        if (widget.noSelectionHTML) contentConfig.noSelectionHTML = widget.noSelectionHTML; // tmp voor oude data
        if (widget.noSelectionLoggedInHTML) contentConfig.noSelectionLoggedInHTML = widget.noSelectionLoggedInHTML;
        if (widget.noSelectionNotLoggedInHTML) contentConfig.noSelectionNotLoggedInHTML = widget.noSelectionNotLoggedInHTML;
        if (widget.selectionActiveLoggedInHTML) contentConfig.selectionActiveLoggedInHTML = widget.selectionActiveLoggedInHTML;
        if (widget.selectionInactiveLoggedInHTML) contentConfig.selectionInactiveLoggedInHTML = widget.selectionInactiveLoggedInHTML;
        if (widget.mobilePreviewLoggedInHTML) contentConfig.mobilePreviewLoggedInHTML = widget.mobilePreviewLoggedInHTML;
        if (widget.selectionActiveNotLoggedInHTML) contentConfig.selectionActiveNotLoggedInHTML = widget.selectionActiveNotLoggedInHTML;
        if (widget.selectionInactiveNotLoggedInHTML) contentConfig.selectionInactiveNotLoggedInHTML = widget.selectionInactiveNotLoggedInHTML;
        if (widget.mobilePreviewNotLoggedInHTML) contentConfig.mobilePreviewNotLoggedInHTML = widget.mobilePreviewNotLoggedInHTML;
        contentConfig.showNoSelectionOnMobile = widget.showNoSelectionOnMobile;

        // allowMultipleImages to formfields
        let formFields = [ ...widget.formFields ];
        let allowMultipleImages = ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.allowMultipleImages ) || false;
        formFields.forEach((formField) => {
          if ( formField.inputType ==  "image-upload" ) {
            formField.allowMultiple = allowMultipleImages;
          }
        });
        
			  widget.config = JSON.stringify({
          // req.data.isAdmin
          divId: 'ideeen-op-de-kaart',
          siteId: req.data.global.siteId,
          api: {
            url: self.apos.settings.getOption(req, 'apiUrl'),
            headers: req.session.jwt ? { 'X-Authorization': 'Bearer ' + req.session.jwt } : [],
            isUserLoggedIn: req.data.loggedIn,
          },
          user: {
            role:  req.data.openstadUser && req.data.openstadUser.role,
            fullName:  req.data.openstadUser && (req.data.openstadUser.fullName || req.data.openstadUser.firstName + ' ' + req.data.openstadUser.lastName)
          },

			    displayType: widget.displayType,
					displayWidth: widget.displayWidth,
					displayHeight: widget.displayHeight,
					linkToCompleteUrl: widget.linkToCompleteUrl,

          canSelectLocation: widget.canSelectLocation,
          startWithListOpenOnMobile: widget.startWithListOpenOnMobile,

          linkToUserPageUrl: widget.linkToUserPageUrl,

          content: contentConfig,
          ideaName: widget.ideaName,
          typeField: widget.typeField,
          types: widget.typeField == 'typeId' ? ideaTypes : themeTypes,
          typeLabel: widget.typeLabel,
          typesFilterLabel: widget.typesFilterLabel,
			    idea: {
            formUrl: widget.formUrl,
            showVoteButtons: req.data.global.siteConfig && req.data.global.siteConfig.ideas && typeof req.data.global.siteConfig.ideas.showVoteButtons != 'undefined' ? req.data.global.siteConfig.ideas.showVoteButtons : true,
            showLabels: req.data.global.siteConfig && req.data.global.siteConfig.ideas && typeof req.data.global.siteConfig.ideas.showLabels != 'undefined' ? req.data.global.siteConfig.ideas.showLabels : true,
            canAddNewIdeas: req.data.global.siteConfig && req.data.global.siteConfig.ideas && typeof req.data.global.siteConfig.ideas.canAddNewIdeas != 'undefined' ? req.data.global.siteConfig.ideas.canAddNewIdeas : true,
				    titleMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.titleMinLength ) || 30,
				    titleMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.titleMaxLength ) || 200,
				    summaryMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.summaryMinLength ) || 30,
				    summaryMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.summaryMaxLength ) || 200,
				    descriptionMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.descriptionMinLength ) || 30,
				    descriptionMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.descriptionMaxLength ) || 200,
				    allowMultipleImages,
            imageserver: {
              // TODO: hij staat nu zonder /image in de .env van de frontend, maar daar zou natuurlijk de hele url moeten staan
				      process: '/image',
				      fetch: '/image',
            },
            fields: formFields,
            shareChannelsSelection: widget.showShareButtons ? widget.shareChannelsSelection : [],
            sort: {
              sortOptions: widget.selectedSorting ? widget.selectedSorting.map(key => sortingOptions.find(option => option.value == key ) ) : [],
              showSortButton: widget.selectedSorting && widget.selectedSorting.length ? true : false,
              defaultSortOrder: widget.defaultSorting,
            }
			    },
			    poll: req.data.global.siteConfig && req.data.global.siteConfig.polls,
			    argument: {
            isActive: widget.showReactions,
            isClosed: req.data.global.siteConfig && req.data.global.siteConfig.arguments && typeof req.data.global.siteConfig.arguments.isClosed != 'undefined' ? req.data.global.siteConfig.arguments.isClosed : false,
            closedText: req.data.global.siteConfig && req.data.global.siteConfig.arguments && typeof req.data.global.siteConfig.arguments.closedText != 'undefined' ? req.data.global.siteConfig.arguments.closedText : true,
            title: widget.reactionsTitle,
            formIntro: widget.reactionsFormIntro,
            placeholder: widget.reactionsPlaceholder,
				    descriptionMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.arguments && req.data.global.siteConfig.arguments.descriptionMinLength ) || 30,
				    descriptionMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.arguments && req.data.global.siteConfig.arguments.descriptionMaxLength ) || 100,
            closeReactionsForIdeaIds: widget.closeReactionsForIdeaIds,
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
