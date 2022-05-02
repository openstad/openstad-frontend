const ideaStates = require('../../../../config/idea.js').states;
const sortingOptions  = require('../../../../config/sorting.js').options;
const authFormFields = require('../../../../config/authForm.js').fields;

const fields = [
  {
    name: 'voting',
    label: 'Enable voting (currently only works with for gridder)',
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
    ]
  },
  {
    name: 'showVoteCount',
    label: 'Show vote count?',
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
  /*
  {
    name: 'displayRanking',
    label: 'Show ranking?',
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
    def: true
  },
 
   */
  {
    name: 'votingType',
    type: 'select',
    label: 'Voting type',
    choices: [
      {
        label: 'Budgeting',
        value: 'budgeting',
        showFields: [ 'maxIdeas', 'minIdeas', 'initialAvailableBudget', 'minimalBudgetSpent' ]
      },
      {
        label: 'Budgeting per thema',
        value: 'budgeting-per-theme',
      },
      {
        label: 'Count',
        value: 'count',
        showFields: [ 'maxIdeas', 'minIdeas' ]
      },
      {
        label: 'Count per thema',
        value: 'count-per-theme',
        showFields: [ 'maxIdeas', 'minIdeas' ]
      },
    ]
  },
  {
    name: 'maxIdeas',
    type: 'integer',
    label: 'Maximum selectable ideas',
    def: 1000,
  },
  {
    name: 'minIdeas',
    type: 'integer',
    label: 'Minimum selectable ideas',
    def: 0,
  },
  {
    name: 'initialAvailableBudget',
    type: 'integer',
    label: 'Available Budget',
  },
  {
    name: 'minimalBudgetSpent',
    type: 'integer',
    label: 'Minimum budget that has to be selected',
  },
  {
    name: 'unavailableButton',
    type: 'string',
    label: 'Unavailable button',
    help: 'Text on the \'Add\' button when the count or budget limits are reached',
    def: 'Geen ruimte',
  },
  {
    name: 'displayBudgetLabel',
    type: 'boolean',
    label: 'Display price label',
    def: true
  },
  {
    name: 'displayOriginalIdeaUrl',
    type: 'select',
    def: false,
    choices: [
      {
        label: 'Yes',
        value: true,
        showFields: ['originalIdeaUrl']
      },
      {
        label: 'No',
        value: false,
      }
    ]
  },
  {
    name: 'originalIdeaUrl',
    type: 'string',
    label: 'Url where orginal urls are found (ideaId is attached to the end)',
    required: true
  },
  {
    name: 'contentArea',
    type: 'area',
    label: 'Content Area',
    contextual: true
  },
  {
    type: 'checkboxes',
    name: 'selectedSorting',
    label: 'Select sorting available (check one or more)',
    choices: sortingOptions
  },
  {
    type: 'select',
    name: 'defaultSorting',
    label: 'Select the default sorting (needs to be checked)',
    choices: sortingOptions
  },
  {
    type: 'boolean',
    name: 'scrollBackToBudgetBlock',
    label: 'Scroll back to budget block when returning from entering vote code in oAuth environment?',
    def: false,
    choices: [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      }
    ]
  },
  {
    name: 'step_1_intro',
    label: 'Step 1: intro',
    type: 'string',
    textarea: true,
    def: 'Kies uit onderstaand overzicht jouw favoriete plannen. Selecteer voor maximaal € 200.000 aan plannen. In stap 3 vul je ter controle de stemcode in die je per post hebt ontvangen. Tot slot verstuur je in stap 4 je stem.'
  },
  {
    name: 'step_2_intro',
    label: 'Step 2: intro',
    type: 'string',
    textarea: true,
    def: 'Bekijk hieronder je selectie. Ben je tevreden? Klik dan onderaan door naar stap 3 om jouw stemcode in te vullen.'
  },
  {
    name: 'step_3_intro',
    label: 'Step 3: intro',
    type: 'string',
    textarea: true,
    def: 'Via onderstaande knop kun je op een aparte pagina je persoonlijke stemcode invullen. Wij controleren de stemcode op geldigheid. Als dat gelukt is kom je terug op deze pagina waarna je kunt stemmen. Alle bewoners van Centrum hebben per post een stemcode ontvangen.'
  },
  {
    name: 'step_3_succesfull_auth',
    label: 'Step 3: succesfull auth',
    type: 'string',
    textarea: true,
    def: 'Het controleren van je stemcode is gelukt! Je bent bijna klaar. Klik op onderstaande knop om je stem te versturen.'
  },
  {
    name: 'thankyou_message',
    label: 'Thank you message',
    type: 'string',
    textarea: true,
    def: 'Bedankt voor het stemmen! De stemperiode loopt van 9 september t/m 6 oktober 2019. Wil je weten welke plannen het vaakst zijn gekozen en uitgevoerd worden? De uitslag wordt op 15 oktober 2019 gepubliceerd op centrumbegroot.amsterdam.nl.'
  },
  {
    name:    'showNewsletterButton',
    label:   'Show newsletter button after voting?',
    type:    'select',
    choices: [
      {
        label: 'No',
        value: 'no'
      },
      {
        label:      'Yes',
        value:      'yes',
        showFields: ['newsletterButtonText']
      }
    ],
    def:     'no'
  },
  {
    name: 'displayRanking',
    label: 'Display ranking',
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
    ]
  },
//   {
//     name: 'authEmbeddedForm',
//     label: 'Auth form embedded',
//     type: 'select',
//     choices: [
//       {
//         value: false,
//         //  label: 'Newest first',
//         label: 'No'
//       },
//       {
//         value: 'url',
//         //  label: 'Newest first',
//         label: 'Email login url',
//         showFields: ['authFormUrllabel', 'authFormUrlButtonText']
//       },
//       {
//         value: 'uniqueCode',
//         //  label: 'Newest first',
//         label: 'Voting code',
//         showFields: ['authFormUniqueCodelabel', 'authFormUniqueCodeButtonText']
//       },
//       {
//         value: 'sms',
//         //  label: 'Newest first',
//         label: 'Sms',
//         showFields: ['authFormSmslabel' , 'authFormSmsButtonText']
//       },
//  
//     ]
//   },
  {
    name: 'newsletterButtonText',
    label: 'Text on the newsletter button',
    type: 'string'
  },
//   ...authFormFields
].concat(
    ideaStates.map((state) => {
      return {
        type: 'string',
        name: 'label' +  state.value,
        label: 'Label for photo: ' + state.value,
      }
    })
);

module.exports = fields;
