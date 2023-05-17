/**
 * A widget for display an argument form
 * Mostly used on a resource page, that loads in an idea data from the url
 */
const fetch = require('node-fetch');
const eventEmitter  = require('../../../events').emitter;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Arguments form old',
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

     self.route('post', 'submit', async function(req, res) {
       eventEmitter.emit('postArgument');

       //let auth = `Basic ${new Buffer("openstad:op3nstad#").toString("base64")}`//
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const appUrl = self.apos.settings.getOption(req, 'appUrl');
       const siteId = req.data.global.siteId;
       const ideaId = req.body.ideaId;

       try {
         let response = await fetch(apiUrl + `/api/site/${siteId}/idea/${ideaId}/argument`, {
           headers: {
             'Content-type': 'application/json',
             'Accept': 'application/json',
             "X-Authorization" : ` Bearer ${req.session.jwt}`,
           },
           method: 'POST',
           body: JSON.stringify(req.body),
         })
         if (!response.ok) {
           console.log(response);
           throw new Error('Fetch failed')
         }
         let result = await response.json();
         res.end(JSON.stringify(result));
       } catch(err) {
         console.log(err);
         res.status(500).end(JSON.stringify(err));
       }

    });

    const superOutput = self.output;

    self.output = function(widget, options) {
      widget.ideaId =  options.activeResource ?  options.activeResource.id : false;
      return superOutput(widget, options);
    };

  }
};
