module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Stemronde',
  addFields: [

  ],
  construct: function(self, options) {

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'jquery.gridder', { when: 'always' });
       self.pushAsset('script', 'ideas-lister', { when: 'always' });
     };

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.userHasVoted = false;
       widget.userIsLoggedIn = false;
       widget.user = {};
       widget.isAdmin = false;
       return superOutput(widget, options);
     };
  }
};
