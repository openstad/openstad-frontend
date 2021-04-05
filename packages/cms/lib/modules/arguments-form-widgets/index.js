/**
 * A widget for display an argument form
 * Mostly used on a resource page, that loads in an idea data from the url
 */
const rp = require('request-promise');
const eventEmitter  = require('../../../events').emitter;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Arguments form',
  adminOnly: true,
  addFields: [
      /*
    {
      name: 'ideaId',
      type: 'string',
      label: 'Idea ID (if empty it will try to fetch the ideaId from the URL)',
    },*/
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder text',
      help: `Will be shown in the input field when the user hasn't typed anything yet.`,
      required: true
    },
    {
      name: 'sentiment',
      type: 'select',
      help: `Select the sentiment when the 'in favor' and 'against' arguments are separately listed. Otherwise, choose 'No sentiment'.`,
      def: '',
      choices: [
        {
          label: 'For',
          value: 'for',
        },
        {
          label: 'Against',
          value: 'against',
        },
      ]
    },
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name:'general',
        label: 'General',
        fields: ['placeholder', 'sentiment']
      },
      {
        name: 'advanced',
        label: 'Advanced',
        fields: ['ideaId']
      }
    ]);


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
