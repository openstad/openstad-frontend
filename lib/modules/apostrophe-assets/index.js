// This configures the apostrophe-assets module to push a 'site.less'
// stylesheet by default, and to use jQuery 3.x

module.exports = {
  jQuery: 3,
  /*stylesheets: [
    {
      name: 'site'
    }
  ],
  scripts: [
    {
      name: 'cookies',
      name: 'site'
    }
  ],

  construct: function(self, options) {
     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('script', 'site', { when: 'always' });
       self.pushAsset('script', 'cookies', { when: 'always' });
     };
   }*/

};
