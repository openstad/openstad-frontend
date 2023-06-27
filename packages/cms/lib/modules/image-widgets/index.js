/**
 * Widget that allows for adding an image
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  name: 'image',
  label: 'Image',
  addFields: [
    {
      name: 'uploadedImage',
      type: 'attachment',
      label: 'Image',
      required: true,
      trash: true,
      svgImages: true
    },
    {
      name: 'uploadedImageTitle',
      type: 'text',
      label: 'Image title',
      type: 'string'
    },
    {
      name: 'uploadedImageAlt',
      type: 'text',
      label: 'Textual alternative',
      type: 'string'
    },
    {
      name: 'displaySize',
      type: 'select',
      label: 'Display size',
      def: 'full',
      choices: [
        {
          value: 'max',
          label: "Max (1600x1600)"
        },
        {
          value: 'full',
          label: "Volledig (1140x1140)",
        },
        {
          value: 'two-thirds',
          label: "Medium-groot (760x760)",
        },
        {
          value: 'one-half',
          label: "Medium (570x700)",
        },
        {
          value: 'one-third',
          label: "Medium-klein (380x700)",
        },
        {
          value: 'one-sixth',
          label: "Klein (190x350)",
        },
      ]
    },
    styleSchema.definition('imageStyles', 'Styles for the image'),

  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'generalGroup',
        label: 'General',
        fields: ['uploadedImage', 'displaySize']
      },
      {
        name: 'stylingGroup',
        label: 'Styling',
        fields: ['imageStyles']
      }
    ]);

    const superLoad = self.load;
    self.load = function (req, widgets, callback) {
        widgets.forEach((widget) => {
          if (widget.imageStyles) {
            const imageId = self.apos.utils.generateId();
            widget.imageId = imageId;
            widget.formattedImageStyles = styleSchema.format(imageId, widget.imageStyles);
          }
        });
      return superLoad(req, widgets, callback);
    };
  }
}
