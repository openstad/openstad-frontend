const rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Arguments',
  addFields: [
    {
      name: 'siteId',
      type: 'string',
      label: 'Site ID',
      required: true
    }
  ],
  construct: function(self, options) {
     const superPushAssets = self.pushAssets;
     //const auth = "Basic " + new Buffer("xxx:xxx#").toString("base64");

     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };

     const superPageBeforeSend = self.pageBeforeSend;

     self.pageBeforeSend = function(req, callback) {
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');

       var options = {
           uri: apiUrl + '/api/site/1/argument',
           headers: {
               'Accept': 'application/json',
      //         "Authorization" : auth
           },
           json: true // Automatically parses the JSON string in the response
       };

       rp(options)
         .then(function (arguments) {
             req.data.arguments = arguments;
            // return callback(null);
            callback();
            return superPageBeforeSend(req, callback);

         })
         .catch(function (err) {
            callback();
            return superPageBeforeSend(req, callback);
         });

     }


  }

  /*  construct: function(self, options) {

    } */
};
