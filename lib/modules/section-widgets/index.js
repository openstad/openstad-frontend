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
          label: 'Full page width ',
          value: 'full-width',
        },
        {
          label: 'One column: 100%',
          value: 'columns-one',
        },
        {
          label: 'Two Columns: 50% - 50%',
          value: 'columns-half',
        },
        {
          label: 'Two Columns: 33% - 66%',
          value: 'columns-onethird',
        },
        {
          label: 'Two Columns: 66% - 33%',
          value: 'columns-twothird-onethird',
        },
        {
          label: 'Two Columns: 75% - 25%',
          value: 'columns-twothird-full',
        },
        {
          label: 'Two Columns: 25% - 75%',
          value: 'columns-onefourth',
        },
        {
          label: 'Two Columns: Desktop: 75% - 25%, Tablet:  66% - 33%',
          value: 'columns-twothird',
        },
        {
          label: 'Three columns: 33% - 33% - 33%',
          value: 'columns-three',
        },
        {
          label: 'Four Columns: 25% - 25% - 25% - 25%',
          value: 'columns-four',
        },
        {
          label: 'Full screen (vertical & horizontal)',
          value: 'full-screen',
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
      name: 'marginType',
      label: 'Margin type',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Normal',
          value: 'normal'
        },
        {
          label: 'Shift upwards',
          value: 'up'
        }
      ]
    },
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
    self.load = function (req, widgets, callback) {
      return superLoad(req, widgets, function (err) {
        if (err) {
          console.log('errerrerr section widget', err);
          return callback(err);
        }

        widgets.forEach((widget) => {
          if (widget.containerStyles) {
            console.log('widget.containerStyles', widget.containerStyles);
            const containerId = styleSchema.generateId();
            widget.containerId = containerId;
            console.log('widget.containerStyles', widget.containerStyles);

            widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
          }
        });
        return callback(null);
      });
    };

  }
};
