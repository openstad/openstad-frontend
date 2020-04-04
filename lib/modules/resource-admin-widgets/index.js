const rp = require('request-promise');
const eventEmitter  = require('../../../events').emitter;

const ideaStates = require('../../../config/idea.js').states;
const extraFields =  require('../../../config/extraFields.js').fields;

const fields = [
  {
    name: 'hideAdminAfterPublicAction',
    label: 'Hide admin after first public action? (not yet connected to the API)',
    type: 'boolean',
    choices: [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      }
    ],
    def: false
  },
]

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Recource admin buttons',
  addFields: fields,
  construct: function(self, options) {
     let classIdeaId;

     require('./lib/routes.js')(self, options);

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.extraFields = extraFields;
       return superOutput(widget, options);
     };



  }
};
