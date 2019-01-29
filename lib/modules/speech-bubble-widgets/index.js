module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Speech Bubble',
  addFields: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      required: true
    },
  ],
  construct: function(self, options) {
     var superPushAssets = self.pushAssets;
     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };
  }
};
