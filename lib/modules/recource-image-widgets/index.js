const styleSchema = require('../../../config/styleSchema.js').default;


const fields = [
  {
    name: 'fallBackToMapImage',
    label: 'Fall back to map image if no image available?',
    type: 'boolean',
    choices: [
      {
        label: 'Yes',
        value: true,
        showFields: []
      },
      {
        label: 'No',
        value: false,
      }
    ]
  },
  {
    name: 'defaultImage',
    type: 'attachment',
    label: 'Default image',
    trash: true
  },
  {
    name: 'imageHeight',
    type: 'string',
    label: 'Image Height (used for resizing dynamic image and map, not default, for performance reasons)',
    required: false,
  },
  {
    name: 'imageWidth',
    type: 'string',
    label: 'Image Width (used for resizing dynamic image and map, not default, for performance reasons)',
    required: false,
  },
  styleSchema.definition('containerStyles', 'Styles for the container')
]

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Recource image',
  addFields: fields,
  construct: function(self, options) {
    const superPushAssets = self.pushAssets;

     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };

     const superLoad = self.load;
     self.load = function (req, widgets, next) {
         widgets.forEach((widget) => {
           if (widget.containerStyles) {
             const containerId = styleSchema.generateId();
             widget.containerId = containerId;
             widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
           }
        });

        return superLoad(req, widgets, next);
     }

  }
};
