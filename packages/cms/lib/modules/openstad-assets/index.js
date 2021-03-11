// This configures the apostrophe-assets module to push a 'site.less'
// stylesheet by default, and to use jQuery 3.x

module.exports = {
  improve: 'apostrophe-assets',
  construct: function(self, options) {
    self.stylesheetsHelper = function(when) {
      console.log('when', when)
      if (self.options.minify) {
        return self.apos.templates.safe('<link href="' + self.assetUrl('/apos-minified/' + when + '-' + self.getThemedGeneration() + '.css') + '" rel="stylesheet" />');
      } else {
        if (self.lessMasters && self.lessMasters[when]) {
          return self.apos.templates.safe('<link href="' + self.assetUrl(self.lessMasters[when].web) + '" rel="stylesheet" />');
        }
        return self.apos.templates.safe(_.map(self.filterAssets(self.pushed['stylesheets'], when), function(stylesheet) {
          return '<link href="' + self.assetUrl(stylesheet.web) + '" rel="stylesheet" />';
        }).join("\n"));
      }
    };
  }
 };
