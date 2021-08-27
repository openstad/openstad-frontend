/**
 * This widget load the react-admin library for managing the site settings, and resources in one panel found under /admin
 * It can be included in a page, has it's own routers.
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Admin panel',
  addFields: [
    //  styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function (self, options) {
    self.apos.app.get('/admin', function (req, res) {
      // Place any data you need to access in your template here:
      //    req.data = {};

      // self.sendPage is what will actually return the page and render the template 'profile.html' in your views folder.
      // You can change 'profile' to the name of your template minus '.html' - e.g. 'page.html' would just be 'page'
      let openstadReactAdminCdn = self.apos.settings.getOption(
        req,
        'siteConfig'
      ).openstadReactAdminCdn;
      return self.sendPage(req, '/page', { openstadReactAdminCdn });
    });
  },
};
