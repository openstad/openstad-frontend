module.exports = {

  arrangeFields: [
    {
      name: 'general',
      label: 'Algemeen',
      fields: ['sentiment', 'isReplyingEnabled', 'isVotingEnabled']
    },
    {
      name: 'list',
      label: 'Lijst',
      fields: ['title', 'emptyListText']
    },
    {
      name: 'form',
      label: 'Formulier',
      fields: ['formIntro', 'placeholder']
    },
  ],

  fields: [

    // general
    {
      name: 'sentiment',
      type: 'select',
      help: `Select the sentiment when the 'in favor' and 'against' reactions are separately listed. Otherwise, choose 'No sentiment'.`,
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
        {
          label: 'No sentiment',
          value: 'no sentiment',
        },
      ]
    },
    {
      name: 'isReplyingEnabled',
      type: 'boolean',
      label: 'Is replying to reactions allowed?',
      def: true,
      choices: [
        {
          value: true,
          label: "Yes"
        },
        {
          value: false,
          label: "No"
        },
      ]
    },
    {
      name: 'isVotingEnabled',
      type: 'boolean',
      label: 'Is voting for reactions allowed?',
      def: true,
      choices: [
        {
          value: true,
          label: "Yes"
        },
        {
          value: false,
          label: "No"
        },
      ]
    },

    // list
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      def: 'Argumenten'
    },
    {
      name: 'emptyListText',
      type: 'string',
      label: 'Placeholder text',
      help: `Will be shown when there are no reactions.`,
      required: true,
      def: 'Nog geen reacties geplaatst'
    },

    // form
    {
      name: 'formIntro',
      type: 'string',
      label: 'Form intro',
      help: `Text above the form`,
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder text',
      help: `Will be shown in the input field when the user hasn't typed anything yet.`,
      required: true,
      def: 'Type hier uw reactie'
    },

  ]

}
