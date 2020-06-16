const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Counter',
  addFields: [
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      required: true,
      help: 'The label shown next to the counter number.',
      def: 'plannen'
    },
    {
      name: 'url',
      type: 'string',
      label: 'Url',
      help: 'URL to visit when the counter is clicked (optional).',
      required: false
    },
    {
      name: 'counterType',
      type: 'select',
      label: 'Select counter type',
      help: `The idea counter dynamically shows the number of uploaded ideas. The number for the static counter can be set by hand.`,
      choices: [
        {
          label: 'Amount of submitted ideas',
          value: 'ideasCount',
        },
        {
          label: 'Amount of votes',
          value: 'voteCount',
					showFields: [
						'voteOpinion'
					]
        },
        {
          label: 'Amount of users that have voted',
          value: 'votedUserCount',
        },
        {
          label: 'Static counter',
          value: 'staticCount',
					showFields: [
						'staticCount'
					]
        },
/*         {
          label: 'Arguments count',
          value: 'argumentsCount',
        },
        */
      ]
    },
    {
      name: 'staticCount',
      type: 'string',
      label: 'Static counter number',
      required: false
    },
    {
      name: 'voteOpinion',
      type: 'select',
      label: 'Which votes to count?',
      choices: [
        {
          label: 'All votes',
          value: '',
        },
        {
          label: 'Only likes / in favor / positive votes',
          value: 'yes',
        },
        {
          label: 'Only dislikes / against / negative votes',
          value: 'no',
        },
      ],
      required: false
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'General',
        fields: ['label', 'url', 'counterType', 'staticCount', 'voteOpinion']
      },
      {
        name: 'stylinggroup',
        label: 'Styling',
        fields: ['containerStyles']
      }
    ]);

    self.getCount = function(widget) {
      let count;
      switch(widget.counterType) {
        case 'ideasCount':
          if (widget.ideasCount) {
            count = widget.ideasCount;
          } else {
            count = 0;
            widget.statsUrl = "/stats/site/" + widget.siteId + "/idea/total"
          }
          break;

        case 'voteCount':
          count = 0;
          widget.statsUrl = "/stats/site/" + widget.siteId + "/vote/total"
          if (widget.voteOpinion) {
            widget.statsUrl += '?opinion=' + widget.voteOpinion;
          }
          break;

        case 'votedUserCount':
          count = 0;
          widget.statsUrl = "/stats/site/" + widget.siteId + "/vote/no-of-users"
          break;

        case 'staticCount':
          count = widget.staticCount;
          break;

        default:
          count = 0;
      }

      return ('000' + count).slice(-3);
    };

    const superLoad = self.load;
    self.load = function (req, widgets, callback) {
        widgets.forEach((widget) => {
          if (widget.containerStyles) {
            const containerId = styleSchema.generateId();
            widget.containerId = containerId;
            widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
          }
          widget.siteId = req.data.global.siteId;

        });

        return superLoad(req, widgets, function (err) {
            if (err) {
                return callback(err);
            }
            // `widgets` is each widget of this type being loaded on a page
            widgets.forEach(function (widget) {
                widget.ideasCount = req.data.ideas ? req.data.ideas.length : false;
            });
            return callback(null);
        });
    };

    const superOutput = self.output;
    self.output = function(widget, options) {
      widget.count = self.getCount(widget);

      return superOutput(widget, options);
    };

    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
    };
  }
};
