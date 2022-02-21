const sortingOptions  = require('../../../../config/sorting.js').ideasOnMapOptions;

module.exports = [

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
		type: 'select',
		name: 'onMarkerClickAction',
		label: 'Op een kaart icon klikken',
    def: true,
		choices: [
			{
				label: 'Selecteert een idee',
				value: 'selectIdea',
			},
			{
				label: 'Toon idee details',
				value: 'showIdeaDetails'
			},
		]
	},
  

	{ 
		name: 'noSelectionHTML',
		type: 'string',
		label: 'noSelectionHTML',
		help: '[ VEROUDERD ] Er is geen punt of plan geselecteerd. LET OP: dit invoerveld is verouderd en wordt in de toekomst helemaal vervangen door noSelectionLoggedInHTML en noSelectionNotLoggedInHTML. Gebruik deze twee invoervelden, als deze nieuwe invoervelden in gebruik zijn, dan wordt dit verouderde invoerveld overschreven.',
		readOnly: true,
		textarea: true,
		required: false,
	},

  { 
    name: 'noSelectionHTML',
    type: 'string',
    label: 'noSelectionHTML',
    help: '[ VEROUDERD ] Er is geen punt of plan geselecteerd. LET OP: dit invoerveld is verouderd en wordt in de toekomst helemaal vervangen door noSelectionLoggedInHTML en noSelectionNotLoggedInHTML. Gebruik deze twee invoervelden, als deze nieuwe invoervelden in gebruik zijn, dan wordt dit verouderde invoerveld overschreven.',
    readOnly: true,
    textarea: true,
    required: false,
  },
  
  { 
    name: 'noSelectionLoggedInHTML',
    type: 'string',
    label: 'noSelectionLoggedInHTML',
    help: 'Er is geen punt of plan geselecteerd, met een {addButton}.',
    textarea: true,
    required: false,
  },
  { 
    name: 'noSelectionNotLoggedInHTML',
    type: 'string',
    label: 'noSelectionNotLoggedInHTML',
    help: 'Er is geen punt of plan geselecteerd, met een {loginButton}.',
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
      },{
        label: 'Geavanceerd',
        value: 'custom',
        showFields: ['mapTilesUrl', 'mapTilesSubdomains'],
      },
    ],
		required: false
	},
  { 
    name: 'mapTilesUrl',
    type: 'string',
    label: 'Url van de tiles server',
    help: 'Ziet er uit als: https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    required: false,
  },
  { 
    name: 'mapTilesSubdomains',
    type: 'string',
    label: 'Subdomains van de tiles server',
    help: 'De mogelijke waarden voor \'s\' hierboven. Meestal \'1234\' of \'abcd\'.',
    required: false,
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
  {
    name: 'mapLocationIcon',
    type: 'string',
    label: 'Default Location icon',
    help: 'JSON object: { "html": "<svg>...</svg>", "className": "osc-ideas-on-map-icon", "width": 39, "height": 50, "iconAnchor": [20,50] }',
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
		label: 'Naam voor ideas',
		def: 'Inzending',
		required: false
	},

	{
		name: 'typeField',
    type: 'select',
		label: 'Veld voor type inzending',
	  choices: [
		  {
			  label: 'Idee type',
			  value: 'typeId',
		  },{
			  label: 'Thema',
			  value: 'extraData.theme',
		  },
	  ],
		def: 'extraData.theme',
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
        showFields: ['reactionsTitle', 'reactionsPlaceholder', 'reactionsFormIntro', 'ignoreReactionsForIdeaIds', 'reactionsClosed'],
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
    name: 'reactionsClosed',
    type: 'select',
    label: 'Reactiemogelijkheid is...',
    help: 'Deze wijzigingen zijn pas zichbaar na een commit',
    default: false,
    choices: [
      {
        value: false,
        label: "...open voor alle ideeën",
      },
      {
        value: true,
        label: "...gesloten voor alle ideeën",
        showFields: ['reactionsClosedText'],
      },
      {
        value: '',
        label: "...gesloten voor sommige ideeën",
        showFields: ['closeReactionsForIdeaIds', 'reactionsClosedText'],
      },
    ],
    def: false,
  },

	{
		name: 'closeReactionsForIdeaIds',
		type: 'string',
		label: 'Ids van Ideas waarvoor reacties gesloten zijn',
		required: false
	},

	{
		name: 'reactionsClosedText',
		type: 'string',
		label: 'Tekst boven gesloten reacties blok',
    help: 'Deze wijzigingen zijn pas zichbaar na een commit',
    default: "De reactiemogelijkheid is gesloten, u kunt niet meer reageren",
		required: false,
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
    name: 'imageAllowMultipleImages',
    type: 'boolean',
    label: 'Meerdere afbeeldingen bij een idee',
    choices: [
      {
        value: true,
        label: "Yes",
      },
      {
        value: false,
        label: "No"
      },
    ],
    def: false
  },

  {
    name: 'imagePlaceholderImageSrc',
    type: 'attachment',
    svgImages: true,
    label: 'Default afbeelding',
    apiSyncField: 'styling.logo',
    trash: true
  },

	{
		name: 'imageAspectRatio',
		type: 'select',
		label: 'Aspect ratio',
		choices: [
			{
				label: '16:9',
				value: '16x9'
			},
			{
				label: '1:1',
				value: '1x1'
			}
		],
    def: '16x9',
	},

  { 
    name: 'metaDataTemplate',
    type: 'string',
    label: 'Metadata regel template',
    help: 'Een regel met {username}, {createDate} en {theme}',
    def: '<span class="ocs-gray-text">Door </span>{username} <span class="ocs-gray-text"> op </span>{createDate} <span class="ocs-gray-text">&nbsp;&nbsp;|&nbsp;&nbsp;</span> <span class="ocs-gray-text">Thema: </span>{theme}',
    required: false,
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

  {
    name: 'searchIn',
    type: 'select',
    label: 'Waar wordt in gezocht',
    choices: [
      {
        value: 'ideas and addresses',
        label: "Zoek in ideeën en adressen",
        showFields: ['searchPlaceHolder','searchAddresssesMunicipality']
      },
      {
        value: 'ideas',
        label: "Zoek in ideeën",
        showFields: ['searchPlaceHolder']
      },
      {
        value: 'addresses',
        label: "Zoek in adressen",
        showFields: ['searchPlaceHolder','searchAddresssesMunicipality']
      },
      {
        value: 'none',
        label: "Geen zoekveld",
      },
    ],
    def: true
  },
	{
		name: 'searchPlaceHolder',
		type: 'string',
		label: 'Placeholder tekst in het zoekveld',
    def: 'Zoek op trefwoord',
		required: false
	},
	{
		name: 'searchAddresssesMunicipality',
		type: 'string',
		label: 'Gemeente waarin naar adressen wordt gezocht',
    help: 'Een lijst van gemeenten is o.m. beschikbaar op Wikipedia: https://nl.wikipedia.org/wiki/Lijst_van_Nederlandse_gemeenten',
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
        label: "Database title: use one word, for example: 'summary' (must be unique, don't use spaces or special characters like - _ , . etc.)",
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
  }

]
