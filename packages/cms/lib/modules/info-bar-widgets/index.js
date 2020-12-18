/**
 * Colored bar for displaying messages with static content on pages
 */
const styleSchema = require('../../../config/styleSchema.js').default;

const parseCookie = (value) => {
  try {
    value = JSON.parse(value);
  } catch(err) {}

  return value;

}

module.exports = {
  extend: 'openstad-widgets',
  label: 'Info bar',
  addFields: [
    {
      name: 'message',
      label: 'Message',
      type: 'string',
      required: true,
      help: 'The message that will be shown in the info bar.'
    },
    {
      name: 'removable',
      help: 'Show a close-button?',
      type: 'boolean',
      required: true
    },
    {
      name: 'backgroundColor',
      label: 'Background color',
      type: 'color',
      required: false
    },
    styleSchema.definition('containerStyles', 'Styles')
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'generalGroup',
        label: 'General',
        fields: ['message', 'removable']
      },
      {
        name: 'stylingGroup',
        label: 'Styling',
        fields: ['backgroundColor', 'containerStyles']
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
      const hiddenInfoBars = parseCookie(req.cookies['hidden-info-bars']) || [];
      widgets.forEach((widget) => {

        /**
         * Users can close an infobar,
         * This is saved in a cookie so we can hide it server side
         */
        widget.hidden = hiddenInfoBars ? hiddenInfoBars.indexOf(widget._id) !== -1 : false;

        if (widget.containerStyles) {
          widget.formattedContainerStyles = styleSchema.format(widget._id, widget.containerStyles);
        }
      });

      return superLoad(req, widgets, callback);
    }

  }
};
