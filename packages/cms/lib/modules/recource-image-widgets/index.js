/**
 * The resource image widget will display an image of the active resource
 * or fallback to an image configured in the widget
 *
 * Needs to be on a page with active resource to work
 */
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
    label: 'Image height - size to download from server, for performance reasons (example: 300px)',
    required: true,
  },
  {
    name: 'imageWidth',
    type: 'string',
    label: 'Image width - size to download from server, for performance reasons (example: 940px)',
    required: true,
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
             const containerId = self.apos.utils.generateId();
             widget.containerId = containerId;
             widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
           }

           widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';

         });

        return superLoad(req, widgets, next);
     }

  }
};
