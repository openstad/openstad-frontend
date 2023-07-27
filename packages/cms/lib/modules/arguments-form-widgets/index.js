/**
 * A widget for display an argument form
 * Mostly used on a resource page, that loads in an idea data from the url
 */
const rp = require('request-promise');
const eventEmitter  = require('../../../events').emitter;
const { fields, arrangeFields } = require('./lib/fields');

module.exports = {
  extend: 'openstad-widgets',
  label: 'Arguments form old',
  adminOnly: true,
  addFields: fields,
  beforeConstruct: function(self, options) {
    options.addFields = fields.concat(options.addFields || []);
  },
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat( arrangeFields );

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

    const superOutput = self.output;

    self.output = function(widget, options) {
      widget.ideaId =  options.activeResource ?  options.activeResource.id : false;
      return superOutput(widget, options);
    };

  }
};
