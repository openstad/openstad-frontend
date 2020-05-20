// This configures the apostrophe-assets module to push a 'site.less'
// stylesheet by default, and to use jQuery 3.x

module.exports = {
  improve: 'apostrophe-assets',
  stylesheets: [
    {
        name: 'site'
    }
  ],
  scripts: [
      {
        name: 'site'
      }
  ]
};
