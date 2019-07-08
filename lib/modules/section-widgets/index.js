const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Column Section',
  controls: {
    position: 'bottom-left'
  },
  addFields: [
    {
      name: 'backgroundColor',
      type: 'color',
      label: 'Background color',
    },
    {
      name: 'backgroundImage',
      type: 'attachment',
      label: 'Background image',
      svgImages: true,
      trash: true
    },
    {
      name: 'displayType',
      label: 'Columns',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Full width',
          value: 'full-width',
        },
        {
          label: 'Full screen',
          value: 'full-screen',
        },

        {
          label: '100',
          value: 'columns-one',
        },
        {
          label: '50 | 50',
          value: 'columns-half',
        },
        {
          label: '33 | 33 | 33',
          value: 'columns-three',
        },
        {
          label: '25 | 25 | 25 | 25',
          value: 'columns-four',
        },
        {
          label: '75 | 25',
          value: 'columns-twothird-full',
        },
        {
          label: '33 | 66',
          value: 'columns-onethird',
        },
        {
          label: '25 | 75',
          value: 'columns-onefourth',
        },
        {
          label: 'Full 75 | 25 - Medium 67 | 33',
          value: 'columns-twothird',
        },
      /*  {
          label: 'icons',
          value: 'icons',
        }, */
      ]
    },
    {
      name: 'area1',
      type: 'area',
      label: 'Area 1',
      contextual: true
    },
    {
      name: 'area2',
      type: 'area',
      label: 'Area 2',
      contextual: true
    },
    {
      name: 'area3',
      type: 'area',
      label: 'Area 3',
      contextual: true
    },
    {
      name: 'area4',
      type: 'area',
      label: 'Area 4',
      contextual: true
    },
    styleSchema.definition('containerStyles', 'Styles for the container'),
    {
      name: 'htmlId',
      type: 'string',
      label: 'HTML ID',
    },
    {
      name: 'htmlClass',
      type: 'string',
      label: 'HTML Class',
    },
  ],
  construct: function(self, options) {
    const superPushAssets = self.pushAssets;
    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
    };

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
  }
};
