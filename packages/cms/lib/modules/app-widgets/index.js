/**
 * This widget load the react-admin library for managing the apply_filters
 * It can be included in a page, has it's own routers.
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'App widgets',
  addFields: [
    {
      name: 'appType',
      type: 'select',
      label: 'Select App type',
      choices: [
        {
          label: 'Editor app',
          value: 'editor',
        },
        {
          label: 'Frontend app',
          value: 'frontend'
        }
      ]
    },
  ],
  construct: function(self, options) {
  }
};
