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
      name: 'appId',
      type: 'string',
      label: 'Set app id',
    },
    {
      name: 'appType',
      type: 'select',
      label: 'Select App type',
      choices: [
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Frontend app',
          value: 'frontend'
        }
      ]
    },
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

    {
      name: 'runFullApp',
      type: 'boolean',
      label: 'Run full app',
    },
    {
      name: 'startState',
      type: 'select',
      label: 'Start state',
      choices: [
        {
          label: 'Sign in',
          value: 'signIn',
        },
        {
          label: 'wizard',
          value: 'wizard'
        }
      ]
    },

  ],
  construct: function(self, options) {
  }
};
