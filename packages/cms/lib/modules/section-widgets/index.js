const styleSchema = require('../../../config/styleSchema.js').default;
const contentWidgets = require('../../../config/contentWidgets.js');
module.exports = {
  extend: 'openstad-widgets',
  label: 'Column Section',
  adminOnly: true,
  controls: {
    position: 'bottom-left'
  },
  playerData: false,
  optionsPlayerData: ['adminOnly'],
  addFields: [
    {
      name: 'backgroundColor',
      type: 'color',
      label: 'Background color',

    },
    {
      name: 'htmlId',
      type: 'string',
      label: 'HTML ID',
    },
    {
      name: 'backgroundImage',
      type: 'attachment',
      label: 'Background image',
      svgImages: true,
      trash: true
    },
  /*  {
      name:     'containerId',
      type:     'string',
      label:    'HTML Container id (must be unique on the page for css)',
    },*/
    {
      name: 'displayType',
      label: 'Columns',
      type: 'select',
      help: 'Select the number of columns and their relative width',
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
          label: 'Three Columns: 25% - 50% - 25%',
          value: 'columns-onefourth-half',
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
        {
          label: 'Tabs',
          value: 'tabs',
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
    {
      name: 'area5',
      type: 'area',
      label: 'Area 5',
      contextual: true
    },
    {
      name: 'area6',
      type: 'area',
      label: 'Area 6',
      contextual: true
    },
    styleSchema.definition('containerStyles', 'Styles for the container'),
    styleSchema.getHelperClassesField(),
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
      name: 'htmlClass',
      type: 'string',
      label: 'HTML Class',
    },
    {
      type: 'boolean',
      name: 'sectionToggle',
      default: true,
      label: 'Show section as toggle-section',
      help: 'The visibility of a toggle-section can be switched on and off by the user.',
      choices: [
        {
          value: true,
          label: "Yes",
          showFields: [
            'sectionOpen', 'mobileToggle', 'toggleTitle', 'typeArrow'
          ]
        },
        {
          value: false,
          label: "No"
        },
      ]
    },
    {
      name: 'toggleTitle',
      type: 'string',
      label: 'Title of the toggle-section',
      help: `The title will always be visible. By clicking on the title the section's visibility toggles.`,
    },
    {
      name: 'typeArrow',
      label: 'Toggle arrow color',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'White',
          value: 'arrow_down_white'
        },
        {
          label: 'Black',
          value: 'arrow_down_black'
        }
      ],
      def: 'arrow_down_black',
    },
    {
      type: 'boolean',
      name: 'sectionOpen',
      default: true,
      label: 'Toggle-section open by default?',
      choices: [
        {
          value: true,
          label: "Open"
        },
        {
          value: false,
          label: "closed"
        },
      ]
    },
    {
      type: 'boolean',
      name: 'mobileToggle',
      default: true,
      label: 'Show toggle-section on mobile only',
      choices: [
        {
          value: true,
          label: "Yes"
        },
        {
          value: false,
          label: "No"
        },
      ]
    },
    {
      name: 'tabs',
      label: 'Tabs',
      type: 'array',
      titleField: 'title',
      schema: [
        {
          type: 'string',
          name: 'title',
          label: 'Title'
        },
        {
          name: 'areaName',
          label: 'Area name',
          help: `
            Because of the structure of the CMS the content needs a set area, so you can select an area.
            This is similar to the columns, area 1 will be the same content as the first column.
            We don't do this automatically because it won't allow for changing the order of the columns
          `,
          type: 'select',
          choices: [
            {
              label: 'Area 1',
              value: 'area1',
            },
            {
              label: 'Area 2',
              value: 'area2',
            },
            {
              label: 'Area 3',
              value: 'area3',
            },
            {
              label: 'Area 4',
              value: 'area4',
            },
            {
              label: 'Area 5',
              value: 'area5',
            },
            {
              label: 'Area 6',
              value: 'area6',
            },
          ]
        },
      ]
    },
  ],


  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'basic',
        label: 'Basic',
        fields: ['displayType']
      },
      {
        name: 'sectionToggleTab',
        label: 'Toggle-section',
        fields: ['sectionToggle', 'toggleTitle', 'sectionOpen', 'mobileToggle']
      },
      {
        name: 'styling',
        label: 'Styling',
        fields: ['backgroundColor', 'backgroundImage', 'containerStyles', 'cssHelperClasses']
      },
      {
        name: 'advanced',
        label: 'Advanced',
        fields: ['containerId', 'marginType', 'htmlId', 'htmlClass']
      },
      {
        name: 'tabs',
        label: 'Tabs',
        fields: ['tabs']
      }
    ]);

    const superPushAssets = self.pushAssets;
    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
      self.pushAsset('script', 'main', { when: 'always' });
    };

    const superLoad = self.load;

    self.load = function (req, widgets, callback) {
      return superLoad(req, widgets, function (err) {
        if (err) {
          return callback(err);
        }

        const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
        const widgetDisplaySettings = siteConfig && siteConfig.cms && siteConfig.cms.widgetDisplaySettings ? siteConfig.cms.widgetDisplaySettings : {};

        widgets.forEach((widget) => {
          //is Admin needs to be set to widget object otherwise it's not present during ajax call
          widget.containerId = self.apos.utils.generateId();
          widget.formattedContainerStyles = styleSchema.format(widget.containerId, widget.containerStyles);
          widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';

          // get the content widget that fit with the role of logged in user and insert data
          const isAdmin = self.apos.permissions.can(req, 'admin');
          widget.contentWidgets = isAdmin ? contentWidgets.getAdminWidgets(widgetDisplaySettings) : contentWidgets.getEditorWidgets(widgetDisplaySettings);

        });
        return callback(null);
      });
    }

    const superOutput = self.output;

    self.output = (widget, options) => {
      Object.keys(widget.contentWidgets).forEach((widgetKey) => {

        if (widgetKey === 'resource-representation' || widgetKey === 'resource-admin' ||  widgetKey === 'participatory-budgeting' || widgetKey === 'arguments-form' || widgetKey === 'arguments' || widgetKey === 'arguments-block' ) {
          widget.contentWidgets[widgetKey] = Object.assign(widget.contentWidgets[widgetKey], {
            pageType: options.pageType ? options.pageType : '',
            activeResource: options.activeResource,
            activeResourceType: options.activeResourceType,
            siteConfig:  options.siteConfig,
          });
        }
      });


      return superOutput(widget, {});
    }
  }
};
