const rp = require('request-promise');


module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Arguments form',
  addFields: [],
  construct: function(self, options) {
     var superPushAssets = self.pushAssets;

     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };

     self.route('post', 'submit', function(req, res) {
       let auth = `Basic ${new Buffer("openstad:op3nstad#").toString("base64")}`//` Bearer ${`;

       console.log('req.authauthauth', auth);

       const options = {
           uri: 'https://api.staging.openstadsdeel.nl/api/site/1/idea/1/argument?access_token=' + req.session.jwt,
           headers: {
               'Accept': 'application/json',
               "Authorization" : auth,
           },
           body: req.body,
           json: true // Automatically parses the JSON string in the response
       };

       rp(options)
         .then(function (response) {
             console.log('response', response);
            // return callback(null);
            res.redirect('/');
         })
         .catch(function (err) {
             console.log('Errrorororo', err);
             res.redirect('/');
         });

      // Access req.body here
      // Send back an AJAX response with `res.send()` as you normally do with Express
    });
  }
};
