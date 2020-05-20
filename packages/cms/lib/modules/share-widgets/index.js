const styleSchema = require('../../../config/styleSchema.js').default;

const fields = [
  {
    type: 'select',
    name: 'displayType',
    label: 'Weergave',
    choices: [
      {
        label: 'Square',
        value: 'share-squares',
      },
      {
        label: 'Round',
        value: 'share-round'
      }
    ]
  },
  styleSchema.definition('containerStyles', 'Styles for the container'),
  {
    name: 'shareChannelsSelection',
    type: 'checkboxes',
    label: 'Select which share buttons you want to display (if left empty all social buttons will be shown)',
    choices: [
        {
            value: 'facebook',
            label: "Facebook"
        },
        {
            value: 'twitter',
            label: "Twitter"
        },
        {
            value: 'mail',
            label: "E-mail"
        },
        {
            value: 'whatsapp',
            label: "Whatsapp"
        },
    ]
  }
]

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Share widgets',
  addFields: fields,
  construct: function(self, options) {
     let classIdeaId;

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
