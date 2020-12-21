/**
 * Widget that allows for adding an iframe
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Iframe',
  adminOnly: true,
  addFields: [
    {
      name: 'url',
      type: 'url',
      required: true
    },
    styleSchema.definition('iframeStyles', 'Styles for the iFrame')
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'generalGroup',
        label: 'General',
        fields: ['url']
      },
      {
        name: 'stylingGroup',
        label: 'Styling',
        fields: ['iframeStyles']
      }
    ]);

    const superLoad = self.load;
    self.load = function (req, widgets, callback) {
        widgets.forEach((widget) => {
          if (widget.iframeStyles) {
            const containerId = widget._id;
            widget.iframeId = containerId;
            widget.formattedIframeStyles = styleSchema.format(containerId, widget.iframeStyles);
          }
        });

        return superLoad(req, widgets, function (err) {
            if (err) {
                return callback(err);
            }
            // `widgets` is each widget of this type being loaded on a page
            widgets.forEach(function (widget) {
                // do something cool, attach it to widget
              //  console.log('----req.data.ideas', req.data.ideas);
                widget.ideasCount = req.data.ideas ? req.data.ideas.length : 0;
            });
            return callback(null);
        });
    };
  }
};
