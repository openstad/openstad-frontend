const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Counter',
  addFields: [
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      required: true
    },
    {
      name: 'url',
      type: 'string',
      label: 'Url',
      required: false
    },
    {
      name: 'counterType',
      type: 'select',
      label: 'Select dynamic counter',
      choices: [
        {
          label: 'Idea count',
          value: 'ideasCount',
        },
        {
          label: 'Vote count',
          value: 'voteCount',
					showFields: [
						'voteOpinion'
					]
        },
        {
          label: 'Voted user count',
          value: 'votedUserCount',
        },
        {
          label: 'Static count',
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
      label: 'Static count',
      required: false
    },
    {
      name: 'voteOpinion',
      type: 'select',
      label: 'opinion',
      choices: [
        {
          label: 'Alles',
          value: '',
        },
        {
          label: 'Ja/Voor',
          value: 'yes',
        },
        {
          label: 'Nee/tegen',
          value: 'no',
        },
      ],
      required: false
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

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
      var count;

  //    console.log('----idget.counterTypes', widget);


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

      widget.count = ('000' + count).slice(-3);
      var result = superOutput(widget, options);
      return result;
    };

    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
    };
  }
};
