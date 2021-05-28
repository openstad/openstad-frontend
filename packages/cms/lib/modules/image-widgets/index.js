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
      name: 'useLink',
      label: 'Add a link to the image?',
      type: 'boolean',
      choices: [
        {
          label: 'Ja',
          value: true,
          showFields: [
            'url',
            'targetBlank',
          ]
        },
        {
          label: 'Nee',
          value: false,
        }
      ],
      def: false
    },
    {
      name: 'url',
      type: 'url',
      label: 'URL',
      required: true
    },
    {
      name: 'targetBlank',
      type: 'boolean',
      label: 'Open in new window',
      choices: [
        {
          label: 'Ja',
          value: true,
        },
        {
          label: 'Nee',
          value: false,
        }
      ],
      def: false
    },
    styleSchema.definition('imageStyles', 'Styles for the image'),

  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'generalGroup',
        label: 'General',
        fields: ['uploadedImage', 'uploadedImageTitle', 'uploadedImageAlt', 'useLink', 'url', 'targetBlank']
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
