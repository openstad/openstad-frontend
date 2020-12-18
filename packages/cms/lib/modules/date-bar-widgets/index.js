/**
 * Widget that display a colord bar with days left to set date
 * Often used for showing days left to submit a plan or vote
 * For example: "10 days left to vote"
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Date countdown bar',
  addFields: [
    {
      name: 'textBeforeDate',
      label: 'Text to show before the set date is passed',
      type: 'string',
      required: true
    },
    {
      name: 'textAfterDate',
      label: 'Text to show after the set date has passed',
      type: 'string',
      required: true
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'generalGroup',
        label: 'General',
        fields: ['date', 'textBeforeDate', 'textAfterDate']
      },
      {
        name: 'stylingGroup',
        label: 'Styling',
        fields: ['containerStyles']
      }
    ]);

    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
      self.pushAsset('script', 'main', { when: 'always' });
    };

    const superLoad = self.load;
    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
        if (widget.containerStyles) {
          const containerId = widget._id;
          widget.containerId = containerId;
          widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
        }
      });


      return superLoad(req, widgets, callback);
    }

  }
};
