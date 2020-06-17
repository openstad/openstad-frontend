/**
 * This widget load the react-admin library for managing the apply_filters
 * It can be included in a page, has it's own routers.
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Admin panel',
  addFields: [
  //  styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    
  }
};
