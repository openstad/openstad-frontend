var _ = require('lodash');

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
    label: 'Paars',
    value: 'purple'
  },
];

module.exports = [
  {
    type: 'string',
    name: 'siteTitle',
    label: 'Site title',
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
    name: 'ideaSlug',
    type: 'string',
    permission: 'admin',
    label: 'Slug van idee pagina',
    help: 'Slug van de ideepagina. Let op: dit wordt in het gebruikersaccount gebruikt om gebruikers naar hun plan te verwijzen. Geef de locatie op van het plan, met daarin {ideaId} voor het plan-Id. Bijvoorbeeld: /plan/{ideaId} of /stemmen#ideaId-{ideaId}',
    apiSyncField: 'cms.ideaSlug',
    required: false
  },
  {
    name: 'ideaOverviewSlug',
    type: 'string',
    permission: 'admin',
    label: 'Slug van overzichts pagina',
    apiSyncField: 'cms.ideaOverviewSlug',
    required: false
  },
  {
    name: 'editIdeaUrl',
    type: 'string',
    permission: 'admin',
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
    type: 'string',
    name: 'captchaRefreshText',
    label: "Text for captcha refresh",
  },

  {
    type: 'boolean',
    name: 'hideSiteTitle',
    label: 'Hide the site title in the header?',
    def: true
  },

  {
    type: 'select',
    name: 'analyticsType',
    permission: 'admin',
    label: 'Analytics type',
    def: 'none',
    choices: [
      {
        value: 'none',
        label: "No analytics",
      },
      {
        value: 'google-analytics-old-style',
        label: "Google Analytics old style (with a property like UA-xxxxx)",
        showFields: ['analyticsIdentifier']
      },
      {
        value: 'google-analytics-new-style',
        label: "Google Analytics new style (with a property like G-xxxxx)",
        showFields: ['analyticsIdentifier']
      },
      {
        value: 'custom',
        label: "Custom: use a custom codeblock",
        showFields: ['analyticsCodeBlock']
      },
      {
        value: 'serverdefault',
        label: "Use the server default settings",
      },
    ]
  },

  {
    type: 'string',
    name: 'analyticsCodeBlock',
    permission: 'admin',
    label: 'Custom code',
    textarea: true,
  },

  {
    type: 'string',
    name: 'analyticsIdentifier',
    permission: 'admin',
    label: 'Google Analytics Property ID (like UA-xxxxx or G-xxxxx)'
  },

  {
    type: 'string',
    name: 'tagmanager',
    permission: 'admin',
    label: 'Google Tag Manager Property ID (like GTM-xxxxx)'
  },
  {
    name: 'siteLogo',
    type: 'attachment',
    svgImages: true,
    label: 'Logo',
    apiSyncField: 'styling.logo',
    trash: true
  },
  {
    name: 'formattedLogo',
    permission: 'admin',
    type: 'string',
    label: 'Formatted Logo',
    formatField: function (value, apos, doc, req) {
      const siteUrl = apos.settings.getOption(req, 'siteUrl');
      return  doc.siteLogo ? siteUrl + apos.attachments.url(doc.siteLogo) : '';
    },
    apiSyncField: 'styling.logo',
  },
  {
    name: 'formattedPaletteCSS',
    permission: 'admin',
    type: 'string',
    label: 'Formatted CSS',
    formatField: function (value, apos, doc) {
      var paletteFields = apos.modules['apostrophe-global'].options.paletteFields;
      var rules = [];

      paletteFields.forEach(function(field) {
        var selectors = field.selector;
        var properties = field.property;
        var fieldValue = doc[field.name];
        var fieldUnit = field.unit || '';

        if (!fieldValue) {
          return;
        }

        if (_.isString(selectors)) {
          selectors = [selectors];
        }

        if (_.isString(properties)) {
          properties = [properties];
        }

        properties.forEach(function (property) {
          selectors.forEach(function (selector) {
            var rule = '';
            if (field.mediaQuery) {
              rule += '@media ' + field.mediaQuery + ' { ';
            }
            if (field.valueTemplate) {
              var regex = /%VALUE%/gi;
              rule += selector + '{ ' + property + ': ' + field.valueTemplate.replace(regex, fieldValue + fieldUnit) + '; }';
            } else {
              rule += selector + ' { ' + property + ': ' + fieldValue + fieldUnit + '; }';
            }

            if (field.mediaQuery) {
              rule += ' } ';
            }
            rules.push(rule);
          });
        });
      });



      return rules.join('');
    },
    apiSyncField: 'styling.inlineCSS',
  },

  {
    name: 'logoLink',
    type: 'string',
    label: 'Where do we want to link the logo towards? (leave empty for default app url)',
    //    apiSyncField: 'logo'
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
    name: 'displayLoginTopLink',
    type: 'boolean',
    label: 'Display login and logout link in top links?'
  },
  {
    name: 'openstreetmapsServerUrl',
    type: 'string',
    label: 'Openstreet Maps ServerUrl (not implemented yet)',
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
      },
      {
        name: 'maxIdeas',
        type: 'integer',
        label: 'Maximum selectable ideas (momenteel alleen voor Budgeting - count per thema)',
      },
      {
        name: 'minIdeas',
        type: 'integer',
        label: 'Minimum selectable ideas (momenteel alleen voor Budgeting - count per thema)',
      },
    ]
  },

  {
    type: 'array',
    name: 'ideaTypes',
    label: 'Typen ideeën',
    apiSyncField: 'ideas.types',
    help: 'Wordt momenteel alleen gebruikt in \'Ideeen op een kaart\' widget',
    schema: [
      {
        name: 'name',
        type: 'string',
        label: 'Naam',
      },
      {
        name: 'id',
        type: 'string',
        label: 'Waarde',
      },
      {
        name: 'label',
        type: 'string',
        label: 'Label op detail pagina',
      },
      {
        name: 'textColor',
        type: 'string',
        label: 'Tekst kleur, onder meer voor labels',
      },
      {
        name: 'backgroundColor',
        type: 'string',
        label: 'Achtergrondkleur, onder meer voor labels',
      },
      {
        name: 'mapicon',
        type: 'string',
        label: 'Icon op de kaart',
      },
      {
        name: 'listicon',
        type: 'string',
        label: 'Icon in ideeën overzicht',
      },
      {
        name: 'buttonicon',
        type: 'string',
        label: 'Icon op buttons',
      },
      {
        name: 'buttonLabel',
        type: 'string',
        label: 'Tekst op buttons',
      },

    ]
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
      {
        name: 'displayWhen',
        label: 'Display depending on user logged in status?',
        type: 'select',
        choices: [
          {
            value: 'always',
            label: "Always display",
          },
          {
            value: 'loggedIn',
            label: "Display when logged in",
          },
          {
            value: 'notLoggedIn',
            label: "Display when not logged in",
          }
        ]
      },
    ]
  },
  {
    name: 'displayMyAcount',
    type: 'boolean',
    label: 'Display my account in main menu?'
  },
  {
    name: 'myAccountButtonText',
    type: 'string',
    label: 'My account button text'
  },
  {
    name: 'cacheIdeas',
    permission: 'admin',
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
    name: 'newsletterModalSubmit',
    type: 'string',
    label: 'Submit button',
    textarea: true,
    def: 'Submit'
  },
  {
    type: 'boolean',
    name: 'useCaptchaForNewsletter',
    label: 'Use a captcha as protection?',
    help: 'The captcha prevents bots from (repeatedly) subscribing to the newsletter, but makes it harder for legitimate users to submit the form.',
    def: true,
    choices: [
      {
        label: 'Yes',
        value: true,
        showFields: [
          'captchaLabel',
          'captchaRefreshText'
        ]
      },
      {
        label: 'No',
        value: false
      }
    ]
  },
  {
    name: 'captchaLabel',
    type: 'string',
    label: 'Captcha Label',
  },
  {
    name: 'newsletterModalCancel',
    type: 'string',
    label: 'Cancel button',
    textarea: true,
    def: 'Cancel'
  },
  // ----------------------------------------------------------------------------------------------------
  // form
  // TODO: dit is al de zoveelste kopie en moet dus naar een lib
  {
    name:       'newsletterModalFormFields',
    label:      'Newsletter form fields',
    help: 'The form default shows a Name and an Email field; if you would like something different you can define that here',
    type:       'array',
    titleField: 'title',
    schema:     [
      {
        type:  'string',
        name:  'name',
        label: 'Fieldname',
        help: 'Name of this field in the API: email, firstName, lastName, displayName or extraData.xxx',
      },
      {
        type:  'string',
        name:  'title',
        label: 'Title'
      },
      {
        type:     'string',
        name:     'placeholder',
        label:    'Placeholder tekst',
        help: 'Text that is placed in an empty field',
      },
      {
        name:    'inputType',
        label:   'Type veld',
        type:    'select',
        choices: [
          {
            label: 'Text',
            value: 'text',
          },
          {
            label: 'Checkbox',
            value: 'checkbox',
          }
        ]
      },
		  {
			  type: 'select',
			  name: 'required',
			  label: 'Required',
        def: 'none',
			  choices: [
				  {
					  label: 'Yes',
					  value: true,
				  },
				  {
					  label: 'No',
					  value: false
				  },
			  ]
		  },
    ]
  },
  // einde form
  // ----------------------------------------------------------------------------------------------------
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
    permission: 'admin',
    type: 'select',
    label: 'What role is necessary to like an idea?',
    choices: rightsChoices,
    def: 'member'
  },
  /*
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
  },*/
  {
    type: 'boolean',
    name: 'applyPaletteStyling',
    label: 'Apply palette styling',
    def: true,
  },

  /*    {
        name: 'roleToComment',
        type: 'select',
        label: 'What role is necessary to comment?',
        choices: rightsChoices,
        def: 'member'
        },*/
];
