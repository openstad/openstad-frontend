var rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Idea form',
  addFields: [
    {
      name: 'siteId',
      type: 'string',
      label: 'Site ID',
      required: true
    }
  ],
 construct: function(self, options) {
   const superPushAssets = self.pushAssets;
   self.pushAssets = function () {
     superPushAssets();
     self.pushAsset('stylesheet', 'trix', { when: 'always' });
     self.pushAsset('stylesheet', 'form', { when: 'always' });

     self.pushAsset('script', 'dropzone', { when: 'always' });
     self.pushAsset('script', 'editor', { when: 'always' });
     self.pushAsset('script', 'trix', { when: 'always' });
     self.pushAsset('script', 'main', { when: 'always' });
   };
  }
};
