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
      label: 'Text for no results',
      required: true
    },
    {
      name: 'replyingEnabled',
      type: 'boolean',
      label: 'Is replying to arguments allowed?',
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
