const rp = require('request-promise');

module.exports = {
  extend: 'openstad-widgets',
  label: 'Arguments',
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
          label: 'Voor',
          label: 'No sentiment',
          value: ''
        },
        {
          label: 'In favor',
          value: 'for',
        },
        {
          label: 'Tegen',
          label: 'Against',
          value: 'against',
        },
    },
    {
      name: 'showLastNameForArguments',
      type: 'select',
      label: 'Show last name for arguments?',
      choices: [
        {
          label: 'Yes',
          value: 'yes'
        },
        {
          label: 'No, only for administrators',
          value: 'adminonly'
        },
        {
          label: 'No',
          value: 'no'
        }
      ],
      def: 'yes'
    },
    {
      name: 'showLastNameForReactions',
      type: 'select',
      label: 'Show last name for reactions?',
      choices: [
        {
          label: 'Yes',
          value: 'yes'
        },
        {
          label: 'No, only for administrators',
          value: 'adminonly'
        },
        {
          label: 'No',
          value: 'no'
        }
      ],
      def: 'yes'
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
        fields: ['replyingEnabled', 'votingEnabled', 'showLastNameForArguments', 'showLastNameForReactions']
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
       return superOutput(widget, options);
     };

     self.addHelpers({
        showLastName: function (type, widget, user) {
            if (type == 'reactions' && (widget.showLastNameForReactions == 'yes' || (widget.showLastNameForReactions == 'adminonly' && user.role == 'admin'))) {
                return user.lastName;
            } else if (type == 'arguments' && (widget.showLastNameForArguments == 'yes' || (widget.showLastNameForArguments == 'adminonly' && user.role == 'admin'))) {
                return user.lastName;
            }

            return '';
        }
     });
   },


};
