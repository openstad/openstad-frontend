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
  playerData: false,
  construct: function(self, options) {


      if(options.openstadApiConfigSync) {
        require('./lib/syncFields.js')(self, options);
      }


      /**
       *  Filter out options by default
       *  if you want to add options to playerdata, add them  in constructor of the widget you want to target
       *  like so self.optionsPlayerData =  ['adminOnly'];
       */
      self.filterOptionsForDataAttribute = function(options) {
        let dataAttributeOptions = {};

        if (self.optionsPlayerData) {

          self.optionsPlayerData.forEach((optionKey) => {
            dataAttributeOptions[optionKey] = options && options[optionKey] ? options[optionKey] : '';
          });

          dataAttributeOptions = self.apos.utils.clonePermanent(dataAttributeOptions, true)
        }

        return dataAttributeOptions;
      };

  }
}
