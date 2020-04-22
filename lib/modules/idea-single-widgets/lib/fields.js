const ideaStates = require('../../../../config/idea.js').states;

const fields = [
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
    name: 'displayRanking',
    label: 'Display ranking?',
    type: 'boolean',
    choices: [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      }
    ],
    def: false
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
  }
].concat(
    ideaStates.map((state) => {
      return {
        type: 'string',
        name: 'label' +  state.value,
        label: 'Label for photo: ' + state.value,
      }
    })
  )
  .concat(
    ideaStates.map((state) => {
      return {
        type: 'string',
        name: 'labelTime' +  state.value,
        label: 'Labelfor time status: : ' + state.value,
      }
    }));

module.exports = fields;
