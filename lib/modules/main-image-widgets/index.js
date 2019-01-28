module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Main Image',
  addFields: [
    {
      name: 'title',
      type: 'string',
      label: 'Title ',
    },
    {
      name: 'image',
      type: 'attachment',
      label: 'Image ',
    },
  ],
/*   stylesheets: [
    {
      name: 'site'
    }
  ],*/
 construct: function(self, options) {
    var superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main-image', { when: 'always' });
    };
  }
};
