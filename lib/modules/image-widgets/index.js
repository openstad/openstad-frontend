const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
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
    styleSchema.definition('imageStyles', 'Styles for the image'),

  ],
  construct: function(self, options) {
    const superLoad = self.load;
    self.load = function (req, widgets, callback) {
        widgets.forEach((widget) => {
          if (widget.imageStyles) {
            const imageId = styleSchema.generateId();
            widget.imageId = imageId;
            widget.formattedImageStyles = styleSchema.format(imageId, widget.imageStyles);
          }
        });
      return superLoad(req, widgets, callback);
    };
  }
}
