const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Link or button',
  addFields: [
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      required: true
    },
    {
      name: 'url',
      type: 'url',
      label: 'URL',
      required: true
    },
    {
      name: 'icon',
      type: 'attachment',
      label: 'Icon',
      required: false,
      trash: true
    },
    {
      name: 'targetBlank',
      type: 'boolean',
      label: 'Open in new window',
    },
    {
      name: 'style',
      type: 'select',
      choices: [
        {
          'label': 'No style',
          'value': 'no-styling'
        },
        {
          'label': 'List style Link',
          'value': 'link-caret--blue'
        },
        {
          'label': 'Link box',
          'value': 'link-box'
        },
        {
          'label': 'Filled button',
          'value': 'filled-button'
        },
        {
          'label': 'Outlined button',
          'value': 'outlined-button'
        },
        {
          'label': 'Next button',
          'value': 'next-button'
        },
      ],
      label: 'Type of style',
      required: true
    },
    {
      name: 'classNameCustom',
      type: 'string',
      label: 'Set Custom classname',
    },
    {
      name: 'addTelephoneProtocol',
      type: 'boolean',
      label: 'Add telephone protocol to link (tel:)',
    },
  /*  {
      name: 'primaryColor',
      type: 'color',
      label: 'Primary color',
      required: false
    },*/
    styleSchema.definition('containerStyles', 'CSS for the button')
  ],
  construct: function(self, options) {
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

     var superPushAssets = self.pushAssets;
     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };
  }
};
