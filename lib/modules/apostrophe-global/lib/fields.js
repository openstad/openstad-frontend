
const rightsChoices =  [
    {
        label: 'Anonymous',
        value: 'anonymous'
    },
    {
        label: 'Registered user',
        value: 'member'
    }
];

const flagChoices = [
    {
        label: 'Groen',
        value: 'green'
    },
    {
        label: 'Donkergroen',
        value: 'dark-green'
    },
    {
        label: 'Grijs',
        value: 'gray'
    },
    {
        label: 'Donkergrijs',
        value: 'dark-gray'
    },
    {
        label: 'Geel',
        value: 'yellow'
    },
    {
        label: 'Blauw',
        value: 'blue'
    },
    {
        label: 'Donkerblauw',
        value: 'dark-blue'
    },
    {
        label: 'Rood',
        value: 'red'
    },
    {
        label: 'Donkerrood',
        value: 'dark-red'
    },
    {
        label: 'Paars',
        value: 'purple'
    },
];

module.exports = [
    {
        type: 'string',
        name: 'siteTitle',
        label: 'Site title'
    },
    {
        name: 'fbImage',
        type: 'attachment',
        svgImages: true,
        label: 'Default FB image when sharing pages (gets overwritten when sharing ideas)',
        trash: true
    },
    {
        name: 'stylesheets',
        label: 'External stylesheets',
        type: 'array',
        titleField: 'url',
        schema: [
            {
                type: 'string',
                name: 'url',
                label: 'Url'
            },
        ]
    },
    {
        name: 'inlineCss',
        label: 'CSS',
        type: 'string',
        textarea: true,
    },
    {
        name: 'favicon',
        type: 'attachment',
        svgImages: true,
        label: 'Favicon',
        trash: true
    },
    {
        type: 'string',
        name: 'siteId',
        label: 'Site ID (overwrite the default site id)'
    },
    {
        name: 'ideaSlug',
        type: 'string',
        label: 'Slug van idee pagina',
        required: false
    },
    {
        name: 'ideaOverviewSlug',
        type: 'string',
        label: 'Slug van overzichts pagina',
        required: false
    },
    {
        name: 'editIdeaUrl',
        type: 'string',
        label: 'Url van de bewerk pagina',
        required: false
    },
    {
        name: 'modbreakAuthor',
        type: 'string',
        label: 'Author of the modbreaks',
        required: false
    },
    {
        type: 'boolean',
        name: 'useCookieWarning',
        label: 'Use a cookie warning',
        def: false,
        choices: [
            {
                label: 'Yes',
                value: true,
                showFields: [
                    'cookiePageLink'
                ]
            },
            {
                label: 'No',
                value: false
            }
        ]
    },
    {
        type: 'string',
        name: 'cookiePageLink',
        label: "Link to 'about cookies' page",
        def: '/about-cookies',
        required: true,
    },
    {
        type: 'boolean',
        name: 'hideSiteTitle',
        label: 'Hide the site title in the header?'
    },
    {
        type: 'string',
        name: 'analytics',
        label: 'Google Analytics Property ID (like UA-xxxxx)'
    },
    {
        type: 'string',
        name: 'tagmanager',
        label: 'Google Tag Manager Property ID (like GTM-xxxxx)'
    },
    {
        type: 'boolean',
        name: 'showAdminBar',
        label: 'Show the admin bar for oauth admin users.'
    },
    {
        name: 'siteLogo',
        type: 'attachment',
        svgImages: true,
        label: 'Logo',
        trash: true
    },
    {
        name: 'logoLink',
        type: 'string',
        label: 'Where do we want to link the logo towards? (leave empty for default app url)',
        apiSyncField: 'logo'
    },
    {
        name: 'mapCenterLat',
        type: 'float',
        label: 'Map center Latitude',
    },
    {
        name: 'mapCenterLng',
        type: 'float',
        label: 'Map center Longitude',
    },
    {
        name: 'mapZoomLevel',
        type: 'range',
        label: 'Map zoom level',
        min: 12,
        max: 17,
        step: 1 // optional
    },
    {
        name: 'mapPolygonsKey',
        type: 'select',
        label: 'Selecteer een polygon',
        apiSyncField: 'area.id',
        choices: 'loadPolygonsFromApi',
    },
    {
        name: 'mapImageFlag',
        type: 'select',
        label: 'Welke kleur vlag moet er getoond worden op de plattegrond in het begroten overzicht en op de planpagina?',
        choices: flagChoices,
        def: 'red'
    },
    {
        name: 'openstreetmapsServerUrl',
        type: 'string',
        label: 'Openstreet Maps ServerUrl (not implemented yet)',
    },
    {
        name: 'areas',
        type: 'array',
        titleField: 'label',
        label: 'Buurten',
        schema: [
            {
                name: 'value',
                type: 'text',
                label: 'Name',
                type: 'string',
            }
        ]
    },
    {
        name: 'themes',
        type: 'array',
        titleField: 'label',
        label: 'Thema\'s',
        schema: [
            {
                name: 'value',
                type: 'text',
                label: 'Name',
                type: 'string',
            },
            {
                name: 'flag',
                type: 'select',
                label: 'Welke vlag moet er getoond worden bij dit thema?',
                choices: flagChoices,
                def: 'blue'
            },
            {
                name: 'mapUploadedFlag',
                type: 'attachment',
                label: 'Upload een vlag (liefst png)',
                trash: true
            },
            {
                name: 'mapFlagWidth',
                type: 'text',
                label: 'Map Flag Width',
                type: 'string',
            },
            {
                name: 'mapFlagHeight',
                type: 'text',
                label: 'Map Flag height',
                type: 'string',
            },
            {
                name: 'mapicon',
                type: 'string',
                label: 'Icon op de kaart (JSON, momenteel alleen Kaartapplicatie)',
            },
            {
                name: 'listicon',
                type: 'string',
                label: 'Icon in de lijst (JSON, momenteel alleen Kaartapplicatie)',
            },
            {
                name: 'color',
                type: 'select',
                label: 'Wat is de kleur van dit thema (momenteel alleen voor Budgeting per thema)',
                type: 'string',
            },
            {
                name: 'initialAvailableBudget',
                type: 'select',
                label: 'Available Budget (momenteel alleen voor Budgeting per thema)',
                type: 'integer',
            },
            {
                name: 'minimalBudgetSpent',
                type: 'select',
                label: 'Minimum budget that has to be selected (momenteel alleen voor Budgeting per thema)',
                type: 'integer',
            }
        ]
    },
    {
        name: 'arrangeMainMenu',
        type: 'checkboxes',
        label: 'How to display the main menu?',
        choices: [
            {
                value: 'default',
                label: "Display pages automatically",
            },
            {
                value: 'manually',
                label: "Arrange menu items manually",
                showFields: ['mainMenuItems']
            },
            {
                value: 'hideMenu',
                label: "Hide the menu items",
                showFields: ['mainMenuItems']
            }
        ]
    },
    {
        name: 'mainMenuItems',
        type: 'array',
        label: 'Menu items',
        titleField: 'mainMenuLabel',
        schema: [
            {
                name: 'mainMenuLabel',
                type: 'string',
                label: 'Label',
            },
            {
                name: 'mainMenuUrl',
                type: 'string',
                label: 'Url',
            },
            {
                name: 'mainMenuTarget',
                type: 'boolean',
                label: 'Open in new window',
            },
        ]
    },
    {
        name: 'ctaButtonText',
        type: 'string',
        label: 'CTA button text',
    },
    {
        name: 'ctaButtonUrl',
        type: 'string',
        label: 'CTA button url',
    },
    {
        name: 'topLinks',
        type: 'array',
        label: 'Top Links',
        titleField: 'label',
        schema: [
            {
                name: 'label',
                type: 'string',
                label: 'Label',
            },
            {
                name: 'url',
                type: 'string',
                label: 'Url',
            },
            {
                name: 'targetBlank',
                type: 'boolean',
                label: 'Open in new tab',
            },
        ]
    },
    {
        name: 'displayLoginTopLink',
        type: 'boolean',
        label: 'Display login and logout link in top links?'
    },
    {
        name: 'displayMyAcount',
        type: 'boolean',
        label: 'Display my account in menu?'
    },
    {
        name: 'cacheIdeas',
        type: 'boolean',
        label: 'Cache ideas? This optimises performance for sites, only works for sites where ideas are static, most voting sits'
    },
    {
        name: 'newsletterModalTitle',
        type: 'string',
        label: 'Title for the popup',
        textarea: true,
        //    def: 'Sign up for the newsletter'
    },
    {
        name: 'newsletterModalDescription',
        type: 'string',
        label: 'Description for the popup',
        textarea: true,
        //  def: 'Sign up for the newsletter to stay up to date when news about this project.'
    },
    {
        name: 'translations',
        type: 'array',
        titleField: 'label',
        label: 'Translations',
        schema: [
            {
                name: 'translation',
                type: 'text',
                label: 'Translation',
                type: 'string',
            },
            {
                name: 'translationUrl',
                type: 'text',
                label: 'Translation page URL',
                type: 'string',
            }
        ]
    },
    {
        name: 'vimeoClientId',
        label: 'Vimeo client id',
        type: 'string'
    },
    {
        name: 'vimeoClientSecret',
        label: 'Vimeo secret id',
        type: 'string'
    },
    {
        name: 'vimeoAcccesToken',
        //helpHtml: 'To get an access token need to login into ve<a href="/"> here </a>',
        type: 'string'
    },
    {
        name: 'vimeoViewSettings',
        //helpHtml: 'To get an access token need to login into ve<a href="/"> here </a>',
        type: 'string'
    },
    {
        name: 'vimeoEmbedSettings',
        //helpHtml: 'To get an access token need to login into ve<a href="/"> here </a>',
        type: 'string'
    },
    {
        name: 'footer',
        type: 'array',
        titleField: 'title',
        schema: [
            {
                name: 'title',
                type: 'text',
                label: 'Titel',
                type: 'string',
            },
            {
                name: 'description',
                type: 'text',
                label: 'Description',
                type: 'string',
                textarea: true
            },
            {
                name: 'links',
                type: 'array',
                label: 'Links',
                titleField: 'label',
                schema: [
                    {
                        name: 'label',
                        type: 'string',
                        label: 'Label',
                    },
                    {
                        name: 'url',
                        type: 'string',
                        label: 'Url',
                    },
                    {
                        name: 'targetBlank',
                        type: 'boolean',
                        label: 'Open in new window',
                    },
                ]
            },
        ]
    },
    {
        name: 'roleToLike',
        type: 'select',
        label: 'What role is necessary to like an idea?',
        choices: rightsChoices,
        def: 'member'
    },
    {
        name: 'canAddNewIdeas',
        type: 'boolean',
        label: 'Allow adding new ideas',
        apiSyncField: 'ideas.canAddNewIdeas',
        help: 'This field will also update the global settings field (ideas.canAddNewIdeas) in the api'
    },
    {
      name: 'titleMinLength',
      type: 'integer',
      label: 'set min title length of an idea',
      apiSyncField: 'ideas.titleMinLength',
      help: 'This field will also update the global settings field (ideas.titleMinLength) in the api'
    },

    /*    {
          name: 'roleToComment',
          type: 'select',
          label: 'What role is necessary to comment?',
          choices: rightsChoices,
          def: 'member'
        },*/
];
