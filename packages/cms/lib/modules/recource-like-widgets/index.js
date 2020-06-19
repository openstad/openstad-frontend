const styleSchema = require('../../../config/styleSchema.js').default;

const fields = [
  {
    type: 'select',
    name: 'displayType',
    label: 'Weergave',
    choices: [
      {
        label: 'Claps',
        value: 'claps',
      },
      {
        label: 'Numberplate',
        value: 'numberplate'
      }
    ]
  },
  styleSchema.definition('containerStyles', 'Styles for the container')
];

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Like',
  addFields: fields,
  construct: function(self, options) {
     let classIdeaId;

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
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
