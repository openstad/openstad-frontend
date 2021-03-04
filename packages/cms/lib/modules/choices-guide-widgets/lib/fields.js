module.exports = [
		{
			name: 'choicesGuideId',
      type: 'select',
			label: 'Kies de keuzewijzer',
      apiSyncField: 'choicesGuide.id',
      choices: 'lijstje',
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
          showFields: ['choicesPreferenceTitle','choicesNoPreferenceYetTitle'],
				},
				{
					label: 'Van min naar plus 100',
					value: 'minus-to-plus-100',
          showFields: ['choicesPreferenceMinColor', 'choicesPreferenceMaxColor','choicesPreferenceTitle','choicesNoPreferenceYetTitle'],
				},
				{
					label: 'In een vlak',
					value: 'plane',
          showFields: ['choicesPreferenceTitle','choicesNoPreferenceYetTitle','choicesInBetweenPreferenceTitle'],
				},
				{
					label: 'Geen: verberg de voorkeuren',
					value: 'hidden',
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
    }, {
      type:     'string',
      name:     'choicesInBetweenPreferenceTitle',
      label:    'Titel boven de keuzes, tussen twee voorkeuren in',
      help:     'Bijvoorbeeld "Je staat precies tussen meerdere voorkeuren in"',
      def:      'Je staat precies tussen meerdere voorkeuren in',
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
  ]
