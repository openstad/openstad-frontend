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
     const auth = "Basic " + new Buffer("openstad:op3nstad#").toString("base64");

     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };


     const superPageBeforeSend = self.pageBeforeSend;

     self.pageBeforeSend = function(req, callback) {
       var options = {
           uri: 'https://:@api.staging.openstadsdeel.nl/api/site/1/argument',
           headers: {
               'Accept': 'application/json',
               "Authorization" : auth
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
           console.log('Errrorororo', err);
          callback(err);
          return superPageBeforeSend(req, callback);
       });

     }


  }

  /*  construct: function(self, options) {

    } */
};
