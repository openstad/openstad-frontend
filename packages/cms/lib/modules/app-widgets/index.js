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
      name: 'editorType',
      type: 'select',
      label: 'Select Editor type',
      choices: [
        {
          label: 'Workout editor',
          value: 'workout',
        },
        {
          label: 'Games editor',
          value: 'games'
        }
      ]
    },
  ],
  construct: function(self, options) {
  }
};
