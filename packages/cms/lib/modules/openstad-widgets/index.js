// Openstad widgets is an extension of the apostrophe-widgets module
//
// ## Additional Options
//
// ### `openstadApiConfigSync`
// This will enable sync fields with the api site config settings
// Every field can be synced with the site config of the api:
//
// ```node
// module.exports = {
//   extend: 'openstad-widgets',
//   openstadApiConfigSync: true,
//   addFields: [{
//      name: 'minimumVotes',
//      type: 'integer',
//      label: 'Minimum votes for an idea',
//      apiSyncField: 'ideas.minimumYesVotes',
//   }]
//   construct: function(self, options) {
//
//   }
// });
// ```

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Openstad widgets',
  openstadApiConfigSync: false,
  construct: function(self, options) {
      if(options.openstadApiConfigSync) {
        require('./lib/syncFields.js')(self, options);
      }
  }
}
