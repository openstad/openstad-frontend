/**
 * This widget load the react-admin library for managing the apply_filters
 * It can be included in a page, has it's own routers.
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'App widgets',
  addFields: [
  //  styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    self.apos.app.get('/admin', function(req, res) {
        // Place any data you need to access in your template here:
    //    req.data = {};

        // self.sendPage is what will actually return the page and render the template 'profile.html' in your views folder.
        // You can change 'profile' to the name of your template minus '.html' - e.g. 'page.html' would just be 'page'
        return self.sendPage(req, '/page', {});
    });
  }
};
