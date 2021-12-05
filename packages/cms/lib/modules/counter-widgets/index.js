/**
 * Widget displays a counter with dynamic count of votes, users voted and ideas submitted
 * Often used to display "120 ideas submitted" "3000 users voted"
 */
const _ = require('lodash');
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
        {
          label: 'Argument count',
          value: 'argumentCount',
          showFields: [
            'argumentIdeaId', 'argumentSentiment'
          ]
        },
        {
          label: 'Choices guide count',
          value: 'choicesGuide',
          showFields: [
            'choicesGuideId'
          ]
        },
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
    {
      name: 'argumentIdeaId',
      type: 'string',
      label: 'Arguemnt idea ID - leave empty to fetch total arguments',
      required: false,
    },
    {
      name: 'argumentSentiment',
      label: 'Argument sentiment',
      type: 'select',
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
        {
          label: 'Both',
          value: '',
        },
      ]
    },
    {
      name: 'choicesGuideId',
      label: 'Choices guide id',
      type: 'string'
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

    const superLoad = self.load;
    self.load = function (req, widgets, callback) {
        widgets.forEach((widget) => {

          const siteConfig = req.data.global.siteConfig;
          if (widget.counterType === 'voteCount') {
            widget.isCountPublic = siteConfig && siteConfig.votes && siteConfig.votes.isViewable ? siteConfig.votes.isViewable : false;
          } else {
            widget.isCountPublic = true;
          }

          if (widget.counterType === 'argumentCount') {
            // todo: hij zou in een resourceobverview het dieaid dynamisch moeten ophalen?
          }
          
          if (widget.containerStyles) {
            const containerId = self.apos.utils.generateId();
            widget.containerId = containerId;
            widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
          }
          widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';

          widget.siteId = req.data.global.siteId;
          
          widget.parsedUrl = widget.url;
          if (widget.parsedUrl) {
            let match = widget.parsedUrl.match(/^http/);
            if (!match) {
              widget.parsedUrl = req.data.siteUrl + widget.parsedUrl;
            }
          }

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

      switch(widget.counterType) {

        case 'ideasCount':
          if (widget.ideasCount) {
            count = widget.ideasCount;
          } else {
            count = 0;
          }
          widget.statsUrl = "/stats/site/" + widget.siteId + "/idea/total"
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

        case 'argumentCount':
          count = 0;
          widget.statsUrl = "/stats/site/" + widget.siteId + "/argument/total"
          let queryparams = [];
          if (widget.argumentIdeaId) queryparams.push( "ideaId=" + widget.argumentIdeaId );
          if (widget.argumentSentiment) queryparams.push( "sentiment=" + widget.argumentSentiment );
          if (queryparams) widget.statsUrl += '?' + queryparams.join('&');
          break;

        case 'choicesGuide':
          count = 0;
          widget.statsUrl = `/stats/site/${widget.siteId}/choicesguides/total`;
          if (widget.choicesGuideId) {
            widget.statsUrl += `?choicesGuideId=${widget.choicesGuideId}`;
          }
          break;

        default:
          count = 0;

      }

      let len = count.toString().length;
      widget.count = ('000' + count).slice(-len);

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
