module.exports = {

    arrangeFields: [
      {
        name: 'general',
        label: 'General',
        fields: ['loginModalMessage', 'placeholder', 'sentiment']
      },
    //   {
    //     name: 'advanced',
    //     label: 'Advanced',
    //     fields: ['ideaId']
    //   }
    ],
  
    fields: [
    {
        name: 'loginModalMessage',
        type: 'string',
        def: 'Log in om een argument te plaatsen, te reageren, of een argument te liken.',
      },

      {
        name: 'placeholder',
        type: 'string',
        label: 'Placeholder text',
        help: `Will be shown in the input field when the user hasn't typed anything yet.`,
        required: true
      },
      {
        name: 'sentiment',
        type: 'select',
        help: `Select the sentiment when the 'in favor' and 'against' arguments are separately listed. Otherwise, choose 'No sentiment'.`,
        def: '',
        choices: [
          {
            label: 'For',
            value: 'for',
          },
          {
            label: 'Against',
            value: 'against',
          },
        ]
      },
    //   {
    //     name: 'ideaId',
    //     type: 'string',
    //     label: 'Idea ID (if empty it will try to fetch the ideaId from the URL)',
    //   },
    ]
  }
  