function createDecisionSchema(depth) {
  if (depth) {
    return [
      {
        type: 'string',
        name: 'title',
        label: 'Titel'
      },
      {
        type: 'select',
        name: 'type',
        label: 'Type',
        choices: [
          {
            label: 'Beslissing',
            value: 'decision',
            showFields: [
              'decisions'
            ]
          },
          {
            label: 'URL',
            value: 'referer',
            showFields: [
              'url'
            ]
          },
          {
            label: 'Uitleg',
            value: 'explainer',
            showFields: [
              'explainer'
            ]
          }
        ]
      },
      {
        type: 'url',
        name: 'url',
        label: 'URL',
        help: 'Opent in nieuw tabblad'
      },
      {
        name: 'explainer',
        label: 'Uitleg',
        type: 'string'
      },
      {
        name: 'decisions',
        label: 'Choices',
        type: 'array',
        titleField: 'title',
        schema: createDecisionSchema(depth-1)
      }
    ]
  }

  return [
    {
      type: 'string',
      name: 'title',
      label: 'Titel'
    },
    {
      type: 'select',
      name: 'type',
      label: 'Type',
      choices: [
        {
          label: 'URL',
          value: 'referer',
          showFields: [
            'url'
          ]
        },
        {
          label: 'Uitleg',
          value: 'explainer',
          showFields: [
            'explainer'
          ]
        }
      ]
    },
    {
      type: 'url',
      name: 'url',
      label: 'URL',
      help: 'Opent in nieuw tabblad'
    },
    {
      name: 'explainer',
      label: 'Uitleg',
      type: 'string'
    }
  ]
}

module.exports = {
    extend: 'openstad-widgets',
    label: 'Beslisboom',
    addFields: [
      {
        type: 'string',
        name: 'title',
        label: 'Titel'
      },
      {
        name: 'decisions',
        label: 'Choices',
        type: 'array',
        titleField: 'title',
        schema: [
          {
            type: 'string',
            name: 'title',
            label: 'Titel'
          },
          {
            type: 'select',
            name: 'type',
            label: 'Type',
            choices: [
              {
                label: 'Beslissing',
                value: 'decision',
                showFields: [
                  'decisions'
                ]
              },
              {
                label: 'URL',
                value: 'referer',
                showFields: [
                  'url'
                ]
              },
              {
                label: 'Uitleg',
                value: 'explainer',
                showFields: [
                  'explainer'
                ]
              }
            ]
          },
          {
            type: 'url',
            name: 'url',
            label: 'URL',
            help: 'Opent in nieuw tabblad'
          },
          {
            name: 'explainer',
            label: 'Uitleg',
            type: 'string'
          },
          {
            name: 'decisions',
            label: 'Choices',
            type: 'array',
            titleField: 'title',
            schema: createDecisionSchema(4)
          },
        ]
      },
      {
        type: 'boolean',
        name: 'devDebug',
        label: 'Enable debug',
        def: false,
      },


    ],
    arrangeFields: [
      {
        name: 'settings',
        label: 'Instellingen',
        fields: ['title', 'decisions'],
      },
      {
        name: 'developer',
        label: 'Developer menu',
        fields: ['devDebug'],
      },
    ],
    // beforeConstruct: function(self, options) {
    // },
    construct: function(self, options) {
      const superLoad = self.load;

      options.playerData = ['_id', 'title', 'decisions', 'flatTree', 'type']
  
      self.load = function(req, widgets, next) {
        widgets.forEach((widget) => {
          const containerId = self.apos.utils.generateId();
          widget.containerId = containerId;

          widget.openstadComponentsCdn = self.apos.settings.getOption(req, 'siteConfig').openstadComponentsCdn;

          function flattenDecisionTree(acc, decision) {
            decision.decisions.map(item => {
              item.previous = decision.id
              item.next = item.decisions ? item.decisions.map(d => d.id) : []
              acc[item.id] = item

              if (item.decisions && item.decisions.length) {
                flattenDecisionTree(acc, item)
              }
            })
          }

          // Flatten decision tree by id
          widget.flatTree = widget.decisions.reduce(function(acc, decision) {
            // setting previous to null lets the widget know its at the start
            decision.previous = null
            decision.next = decision.decisions.map(d => d.id)
            acc[decision.id] = decision

            // recursive loop
            if (decision.decisions && decision.decisions.length) {
              flattenDecisionTree(acc, decision)
            }

            return acc
          }, {})

        })

        return superLoad(req, widgets, next);
      }  

      var superPushAssets = self.pushAssets;
      self.pushAssets = function() {
        superPushAssets();
        self.pushAsset('script', 'always', { when: 'always' });
      };
    }
  };