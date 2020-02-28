const sortingOptions = require('../../../config/sorting.js').options;
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;


const ideaStates = require('../../../config/idea.js').states;
const fields = [
  {
    name: 'voting',
    label: 'Enable voting (currently only works with for gridder)',
    type: 'boolean',
    choices: [
      {
        label: 'Yes',
        value: true,
        showFields: [
          'vote_block_show_text_1',
          'vote_block_show_text_2',
        ]
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
  {
    name: 'showRanking',
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
  {
    name: 'votingType',
    type: 'select',
    label: 'Voting type',
    choices: [
      {
        label: 'Budgeting',
        value: 'budgeting',
        showFields: [ 'initialAvailableBudget', 'minimalBudgetSpent' ]
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
    ]
  },
  {
    name: 'maxIdeas',
    type: 'integer',
    label: 'Maximum selectable ideas',
  },
  {
    name: 'minIdeas',
    type: 'integer',
    label: 'Minimum selectable ideas',
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
    name: 'displayBudgetLabel',
    type: 'boolean',
    label: 'Display price label',
  },
  {
    name: 'originalIdeaUrl',
    type: 'string',
    label: 'Url where orginal urls are found (ideaId is attached to the end)',
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
  {
    name: 'newsletterButtonText',
    label: 'Text on the newsletter button',
    type: 'string'
  },
].concat(
    ideaStates.map((state) => {
      return {
        type: 'string',
        name: 'label' +  state.value,
        label: 'Label for photo: ' + state.value,
      }
    })
  )

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Begroot',
  addFields: fields,
  construct: function(self, options) {
     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'overview', { when: 'always' });
       self.pushAsset('stylesheet', 'steps', { when: 'always' });
       self.pushAsset('stylesheet', 'helpers', { when: 'always' });
       self.pushAsset('stylesheet', 'mobile-accordion', { when: 'always' });
       self.pushAsset('stylesheet', 'end-date-bar', { when: 'always' });
       self.pushAsset('stylesheet', 'budget-block', { when: 'always' });
       self.pushAsset('stylesheet', 'button-vote', { when: 'always' });
       self.pushAsset('stylesheet', 'button-add', { when: 'always' });
       self.pushAsset('stylesheet', 'sticky', { when: 'always' });
       self.pushAsset('stylesheet', 'gridder', { when: 'always' });

       self.pushAsset('script', 'sticky', { when: 'always' });
       self.pushAsset('script', 'accordion', { when: 'always' });
       self.pushAsset('script', 'jquery.gridder', { when: 'always' });
       self.pushAsset('script', 'ideas-lister', { when: 'always' });

       self.pushAsset('script', 'find-polyfill', { when: 'always' });
       self.pushAsset('script', 'voting', { when: 'always' });
       self.pushAsset('script', 'westbegroot-enhancements', { when: 'always' });
     };

     const superLoad = self.load;

     self.load = function (req, widgets, callback) {
    /*    const acceptedIdeas = req.data.ideas ? req.data.ideas.filter(idea => idea.status === 'ACCEPTED') : []; */
        widgets.forEach((widget) => {
          widget.acceptedIdeas = req.data.ideas;
        });

        return superLoad(req, widgets, callback);
     };

     const superOutput = self.output;
     self.output = function(widget, options) {
       // add the label to the select sort options for displaying in the select box
       widget.selectedSorting = widget.selectedSorting ? widget.selectedSorting.map((sortingValue) => {
         const sortingOption = sortingOptions.find(sortingOption => sortingOption.value === sortingValue);
         return {
           value: sortingValue,
           label: sortingOption ? sortingOption.label : sortingValue
         }
       }) : [];

       widget.formatImageUrl = function (url, width, height, crop, location) {
         if (url) {
           url = url + '/:/rs=w:'+ width + ',h:' + height;
           url =  crop ? url + ';cp=w:' + width + ',h:' + height : url;
         } else if (location) {
           url = `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${location.coordinates[0]},${location.coordinates[1]}&heading=151.78&key=${googleMapsApiKey}`;
         } else {
           url = '/img/placeholders/idea.jpg';
         }

         return url;
       }

       widget.userHasVoted = false;
       widget.userIsLoggedIn = false;
       return superOutput(widget, options);
     };
  }
};
