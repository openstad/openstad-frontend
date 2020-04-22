const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Date bar',
  addFields: [
    {
      name: 'textBeforeDate',
      label: 'Text before the date',
      type: 'string',
      required: true
    },
    {
      name: 'textAfterDate',
      label: 'Text after the date',
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
          const containerId = styleSchema.generateId();
          widget.containerId = containerId;
          widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
        }
      });


      return superLoad(req, widgets, callback);
    }

  }
};
