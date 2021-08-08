/**
 * This widget load the react-admin library for managing the site settings, and resources in one panel found under /admin
 * It can be included in a page, has it's own routers.
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Account page',
  addFields: [
    //  styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  /**
   * Render account page for user.
   *
   * @param self
   * @param options
   */
  construct: function(self, options) {
    self.apos.app.get('/account', function(req, res) {
      return self.sendPage(req, '/account');
    });
  }
};
