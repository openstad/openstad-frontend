/**
 * A widget for displaying a list of arguments it's reactions, and a reaction form
 * Needs to be placed on a resource form 
 */
const rp = require('request-promise');

module.exports = {
  extend: 'openstad-widgets',
  label: 'Arguments old',
  alias: 'arguments',
  adminOnly: true,
  addFields: [
  /*
    Not being used for now,
    but might in the future
    {
      name: 'ideaId',
      type: 'string',
      label: 'Idea ID (if empty it will try to fetch the ideaId from the URL)',
    },*/
    {
      name: 'emptyPlaceholder',
      type: 'string',
      label: 'Placeholder text',
      help: `Will be shown when there are no arguments.`,
      required: true,
      def: 'Nog geen reacties geplaatst'
    },
    {
      name: 'replyingEnabled',
      type: 'boolean',
      label: 'Is replying to arguments allowed?',
      def: true,
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
    },
    {
      name: 'votingEnabled',
      type: 'boolean',
      label: 'Is voting for arguments allowed?',
      def: true,
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
    },
    {
      name: 'argumentSentiment',
      type: 'select',
      def: '',
      help: `Select the sentiment when the 'in favor' and 'against' arguments are separately listed. Otherwise, choose 'No sentiment'.`,
      choices: [
        {
          label: 'In favor',
          value: 'for',
        },
        {
          label: 'Tegen',
          label: 'Against',
          value: 'against',
        },
      ]
    },
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'General',
        fields: ['argumentSentiment', 'emptyPlaceholder']
      },
      {
        name: 'advanced',
        label: 'Advanced',
        fields: ['replyingEnabled', 'votingEnabled']
      }
    ]);


     const superPushAssets = self.pushAssets;
     //const auth = "Basic " + new Buffer("xxx:xxx#").toString("base64");

     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('script', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };

     var superOutput = self.output;
     self.output = function(widget, options) {
       widget.ideaId =  options.activeResource ?  options.activeResource.id : false;
       widget.activeResourceType = options.activeResourceType;
       widget.activeResource = options.activeResource ?  options.activeResource : {};
       widget.activeResourceId =  options.activeResource ?  options.activeResource.id : false;
       return superOutput(widget, options);
     };

   },
};
