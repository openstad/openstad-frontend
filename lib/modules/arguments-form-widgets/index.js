const rp = require('request-promise');
const eventEmitter  = require('../../../events').emitter;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Arguments form',
  adminOnly: true,
  addFields: [
    {
      name: 'ideaId',
      type: 'string',
      label: 'Idea ID (if empty it will try to fetch the ideaId from the URL)',
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder',
      required: true
    },
    {
      name: 'sentiment',
      type: 'select',
      choices: [
        {
          label: 'Voor',
          value: 'for',
        },
        {
          label: 'Tegen',
          value: 'against',
        },
      ]
    },
  ],
  construct: function(self, options) {
     var superPushAssets = self.pushAssets;

     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
     };

     self.route('post', 'submit', function(req, res) {
       eventEmitter.emit('postArgument');

       //let auth = `Basic ${new Buffer("openstad:op3nstad#").toString("base64")}`//
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const appUrl = self.apos.settings.getOption(req, 'appUrl');
       const siteId = req.data.global.siteId;
       const ideaId = req.body.ideaId;

       const options = {
          method: 'POST',
           uri:  apiUrl + `/api/site/${siteId}/idea/${ideaId}/argument`,
           headers: {
               'Accept': 'application/json',
               "X-Authorization" : ` Bearer ${req.session.jwt}`,
           },
           body: req.body,
           json: true // Automatically parses the JSON string in the response
       };

       rp(options)
         .then(function (response) {
            res.end(JSON.stringify(response));
         })
         .catch(function (err) {
            res.status(500).end(JSON.stringify(err));
         });

      // Access req.body here
      // Send back an AJAX response with `res.send()` as you normally do with Express
    });
  }
};
