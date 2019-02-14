module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link box',
  addFields: [
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      required: true
    },
    {
      name: 'url',
      type: 'url',
      label: 'URL',
      required: true
    },
    {
      name: 'icon',
      type: 'attachment',
      label: 'Icon',
      required: false
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
