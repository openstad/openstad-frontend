module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Begroot',
  addFields: [
    {
      name: 'phase',
      label: 'Huidige fase',
      type: 'select',
      choices: [
        {
          label: 'Stemronde',
          value: 'voting',
        },
        {
          label: 'Afgelopen',
          value: 'finished',
        }
      ]
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

  ],
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
       self.pushAsset('script', 'jquery.gridder.min', { when: 'always' });
       self.pushAsset('script', 'ideas-lister', { when: 'always' });

  //     self.pushAsset('script', 'westbegroot', { when: 'always' });
      self.pushAsset('script', 'voting', { when: 'always' });
       self.pushAsset('script', 'westbegroot-enhancements', { when: 'always' });
     };

     const superLoad = self.load;

     self.load = function (req, widgets, callback) {
        const acceptedIdeas = req.data.ideas ? req.data.ideas.filter(idea => idea.status === 'ACCEPTED') : [];
        widgets.forEach((widget) => {
          widget.acceptedIdeas = acceptedIdeas;
        });
        return superLoad(req, widgets, callback);
     };

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.userHasVoted = false;
       widget.userIsLoggedIn = false;
       return superOutput(widget, options);
     };
  }
};
