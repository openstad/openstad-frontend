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
          label: 'Indienronde',
          value: 'submitting',
        },
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
      name: 'infoMessage',
      type: 'string',
      label: 'Informatie bericht',
      required: true
    }
  ],
  construct: function(self, options) {
     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'sticky', { when: 'always' });
       self.pushAsset('script', 'accordion', { when: 'always' });
       self.pushAsset('script', 'jquery.gridder.min', { when: 'always' });
       self.pushAsset('script', 'ideas-gridder-list', { when: 'always' });
       self.pushAsset('script', 'westbegroot', { when: 'always' });
       self.pushAsset('script', 'westbegroot-enhancements', { when: 'always' });
     };

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.userHasVoted = false;
       widget.userIsLoggedIn = false;
       return superOutput(widget, options);
     };
  }
};
