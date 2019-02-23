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
       //let auth = `Basic ${new Buffer("openstad:op3nstad#").toString("base64")}`//
       let auth = ` Bearer ${req.session.jwt}`;
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const appUrl = self.apos.settings.getOption(req, 'appUrl');
       const siteId = 1;
       const ideaId = 3;

       const options = {
          method: 'POST',
           uri:  apiUrl + `/api/site/${siteId}/idea/${ideaId}/argument`,
           headers: {
               'Accept': 'application/json',
      //         "Authorization" : auth,
           },
           body: req.body,
           json: true // Automatically parses the JSON string in the response
       };

       console.log('options', options);

       rp(options)
         .then(function (response) {
            const redirectTo = req.header('Referer')  || appUrl
            res.redirect(redirectTo + '/#arg'+response.id);
         })
         .catch(function (err) {
            res.redirect(req.header('Referer')  || appUrl);
         });

      // Access req.body here
      // Send back an AJAX response with `res.send()` as you normally do with Express
    });
  }
};
