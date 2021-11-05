const sortingOptions  = require('../../../../config/sorting.js').ideasOnMapOptions;

module.exports = [

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
        value: '',
      },
    ]
  },
  {
    name: 'isClosed',
    type: 'boolean',
    label: 'Can users send in reactions - i.e. is a form shown',
    def: false,
    choices: [
      {
        value: false,
        label: "Yes",
        showFields: ['isReplyingEnabled', 'isVotingEnabled']
      },
      {
        value: true,
        label: "No",
        showFields: ['closedText']
      },
    ]
  },
  {
    name: 'closedText',
    type: 'string',
    label: 'Reactions are closed description',
    help: `Will be shown at the top of the list`,
    required: true,
    def: 'Het plaatsen van argumenten is gesloten'
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
