module.exports = [
	{
		name: 'choicesGuideId',
    type: 'select',
		label: 'Kies de keuzewijzer',
    apiSyncField: 'choicesGuide.id',
    choices: 'lijstje',
		required: true
	},
// mutiple questionGroups is not quite ready and is therefore turned of in the interface
//  {
//  	name: 'questionGroupId',
//    type: 'integer',
//  	label: 'Id van de vragen groep',
//  	required: true,
//  },
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
        showFields: ['choicesPreferenceTitle','choicesInBetweenPreferenceTitle','choicesWithPercentage','choicesMinLabel','choicesMaxLabel'],
			},
			{
				label: 'Van min naar plus 100',
				value: 'minus-to-plus-100',
        showFields: ['choicesPreferenceMinColor','choicesPreferenceMaxColor','choicesPreferenceTitle','choicesInBetweenPreferenceTitle','choicesWithPercentage','choicesMinLabel','choicesMaxLabel'],
			},
			{
				label: 'In een vlak',
				value: 'plane',
        showFields: ['choicesPreferenceTitle','choicesInBetweenPreferenceTitle','choicesWithPercentage','choicesMinLabel','choicesMaxLabel'],
			}
		]
	},
  {
    type:     'string',
    name:     'choicesPreferenceMinColor',
    label:    'Kleur van de balken, minimaal',
    help:     'Dit moet (nu nog) in het formaat #123456',
    def:      '#ff9100',
  }, {
    type:     'string',
    name:     'choicesPreferenceMaxColor',
    label:    'Kleur van de balken, maximaal',
    help:     'Dit moet (nu nog) in het formaat #123456',
    def:      '#bed200',
  }, {
    type:     'string',
    name:     'choicesPreferenceTitle',
    label:    'Titel boven de keuzes, met voorkeur',
    help:     'Bijvoorbeeld "Jouw voorkeur is {preferredChoice}"',
    def:      'Jouw voorkeur is {preferredChoice}',
  }, {
    type:     'string',
    name:     'choicesInBetweenPreferenceTitle',
    label:    'Titel boven de keuzes, tussen twee voorkeuren in',
    help:     'Bijvoorbeeld "Je staat precies tussen meerdere voorkeuren in"',
    def:      'Je staat precies tussen meerdere voorkeuren in',
  }, {
    type:     'string',
    name:     'choicesMinLabel',
    label:    'Tekst links bij de balken',
  }, {
    type:     'string',
    name:     'choicesMaxLabel',
    label:    'Tekst rechts bij de balken',
  },{
    type:     'string',
    name:     'requireLoginTitle',
    label:    'Titel',
  }, {
    type:     'string',
    name:     'requireLoginDescription',
    label:    'Beschrijving',
  }, {
    type:     'string',
    name:     'requireLoginButtonTextLogin',
    label:    'Tekst op de button - je moet nog inloggen',
  }, {
    type:     'string',
    name:     'requireLoginButtonTextLoggedIn',
    label:    'Tekst op de button - je bent ingelogd',
  }, {
    type:     'string',
    name:     'requireLoginButtonTextAlreadySubmitted',
    label:    'Tekst op de button - je hebt al gestemd',
  }, {
    type:     'string',
    name:     'requireLoginChangeLoginLinkText',
    label:    'Tekst voor link \'Opnieuw inloggen\'',
  }, {
    type:     'string',
    name:     'requireLoginLoggedInMessage',
    label:    '\'Login gelukt\' bericht',
  }, {
    type:     'string',
    name:     'requireLoginNotYetLoggedInError',
    label:    'Foutmelding als je nog niet bent ingelogd',
  }, {
    type:     'string',
    name:     'requireLoginAlreadySubmittedMessage',
    label:    '\'Je hebt al gestemd\' bericht',
  }, {
    type: 'boolean',
    name:     'choicesWithPercentage',
    label:    'Toon percentage achter de balk',
    def:      false,
    
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
					'form', "requireLogin"
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
  }, {
    type:     'string',
    name:     'formIntro',
    label:    'Intro',
    textarea: true
  }, {
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
            label: 'Text',
            value: 'text',
          },
          {
            label: 'Textarea',
            value: 'textarea',
          },
          {
            label: 'Radio buttons',
            value: 'radios',
            showFields: ['choices'],
          },
          {
            label: 'Selection (dropdown)',
            value: 'select',
            showFields: ['choices'],
          },
          {
            label: 'Postcode',
            value: 'postcode',
          },
        ]
      },
      {
        name:       'choices',
        label:      'Keuzes',
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
    ]
  },
  // einde uit user-form
  // ----------------------------------------------------------------------------------------------------

]
