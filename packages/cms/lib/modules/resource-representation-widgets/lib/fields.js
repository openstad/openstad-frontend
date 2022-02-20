const ideaStates = require('../../../../config/idea.js').states;
const styleSchema = require('../../../../config/styleSchema.js').default;
const resourcesSchema = require('../../../../config/resources.js').schemaFormat;
const labels = ideaStates.map((state) => { return 'label' +  state.value});
const timeLabels = ideaStates.map((state) => { return 'labelTime' +  state.value});

const fields = [
  {
    name: 'displayType',
    label: 'Representation',
    type: 'select',
    choices: [
      {
        'label': 'Idea Page (only for idea resource)',
        'value': 'idea-page',
        'showFields' : [
          'showShareButtons',
          'displayRanking',
          'shareChannelsSelection',
          'defaultImage',
          'hideStatus',
          'shareTitle'
        ].concat(labels).concat(timeLabels)
      },
      {
        'label': 'Title',
        'value': 'title',
      },
      {
        'label': 'Description',
        'value': 'description',
      },
      {
        'label': 'Summary',
        'value': 'summary',
      },
      {
        'label': 'Standard Information overview (title, category, date, summary, description)',
        'value': 'information-overview',
      },
      {
        'label': 'Website & address info',
        'value': 'website-address',
      },
      {
        'label': 'Help needed',
        'value': 'help-needed',
      },
      {
        'label': 'User activity',
        'value': 'user-activity',
        showFields: ['ideaPageUrl']
      },
      {
        'label': 'User active sites',
        'value': 'user-sites-active',
      }
    ]
  },
  styleSchema.definition('containerStyles', 'Styles for the container'),
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
    type: 'string',
    name: 'ideaPageUrl',
    label: 'Url for the idea page'
   },
  {
    name: 'defaultImage',
    type: 'attachment',
    label: 'Default image',
    trash: true
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
      name: 'hideStatus',
      type: 'boolean',
      label: 'Hide status in controls?',
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
    name: 'shareTitle',
    type: 'string',
    label: 'Title above share buttons (default: Deel dit voorstel)'
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
