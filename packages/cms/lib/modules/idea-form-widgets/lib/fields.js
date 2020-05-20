const fields = [
     {
        name: 'redirect',
        type: 'string',
        label: 'Redirect after submit',
        required: true
    },
    {
        name: 'formType',
        type: 'select',
        label: 'How do you want to organise the form?',
        choices: [
            {
              value: 'static',
              label: "Static (default)"
            },
            {
              value: 'dynamic',
              label: "Dynamic",
              showFields: ['dynamicFormSections']
            },
        ]
    },
    {
      name: 'hideAdminAfterPublicAction',
      label: 'Hide admin after first public action? (not yet connected to the API)',
      type: 'boolean',
      choices: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        }
      ],
      def: false
    },
    {
      name: 'dynamicFormSections',
      label: 'Form Sections',
      type: 'array',
      titleField: 'title',
      schema: [
        {
          type: 'string',
          name: 'title',
          label: 'Title'
        },
        {
          type: 'string',
          name: 'info',
          label: 'Info'
        },
        {
          type: 'array',
          titleField: 'fieldKey',
          name: 'fields',
          label: 'Form fields',
          schema: [
            {
              type: 'select',
              name: 'type',
              label: 'Type',
              required: true,
              choices: [
                  {
                      value: 'radio',
                      label: "Radio",
                      showFields: ['fieldKey', 'fieldRequired', 'fieldOptions']
                  },
                  {
                      value: 'text',
                      label: "Text",
                      showFields: ['fieldKey', 'fieldRequired', 'fieldMin', 'fieldMax']
                  },
                  {
                      value: 'textarea',
                      label: "Textarea",
                      showFields: ['fieldKey', 'fieldRequired', 'fieldMin', 'fieldMax']
                  },
                  {
                      value: 'hidden',
                      label: "Hidden",
                      showFields: ['fieldKey','fieldValue']
                  },
                  {
                      value: 'tags',
                      label: "Tags (currently only works for ideas)",
                      showFields: ['fieldRequired']
                  },
                  {
                      value: 'advice',
                      label: "Advice"
                  },
                  {
                      value: 'neighborhood',
                      label: "Neighborhood"
                  },
                  {
                      value: 'budget',
                      label: "Budget"
                  },
                  {
                      value: 'description',
                      label: "Description"
                  },
                  {
                      value: 'estimate',
                      label: "Estimate"
                  },
                  {
                      value: 'image',
                      label: "Image"
                  },
                  {
                      value: 'map',
                      label: "Map"
                  },
                  {
                      value: 'phone',
                      label: "Phone"
                  },
                  {
                      value: 'role',
                      label: "Role"
                  },
                  {
                      value: 'summary',
                      label: "Summary"
                  },

                  {
                      value: 'theme',
                      label: "Theme"
                  },
                  {
                      value: 'title',
                      label: "Title"
                  },
                  {
                      value: 'vimeo',
                      label: "Vimeo",
                      showFields: ['fieldRequired']
                  },
                ]
            },
            {
              name: 'fieldKey',
              type: 'string',
              label: 'Key (for storing, must be unique, no spaces and special characters)',
            },
            {
              name: 'fieldValue',
              type: 'string',
              label: 'Value (for fixed values)',
            },
            {
              name: 'fieldInfo',
              type: 'string',
              label: 'Info',
            },
            {
              name: 'fieldRequired',
              label: 'Required',
              type: 'boolean'
            },
            {
              name: 'fieldMin',
              label: 'Min length',
              type: 'string',
            },
            {
              name: 'fieldMax',
              label: 'Max length',
              type: 'string',
            },
            {
              name: 'fieldOptions',
              label: 'Field options',
              titleField: 'label',
              type: 'array',
              schema: [
                {
                  type: 'string',
                  name: 'value',
                  label: 'Value',
                },
                {
                  type: 'string',
                  name: 'label',
                  label: 'Label',
                },
              ]
            },


          ]
        },
      ]
    },
    {
       name: 'labelTitle',
       type: 'string',
       label: 'Label for Title',
    },
    {
       name: 'infoTitle',
       type: 'string',
       label: 'Info for Title',
    },

    {
        name: 'requiredTitle',
        type: 'boolean',
        label: 'This field is required',
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
       name: 'labelSummary',
       type: 'string',
       label: 'Label for Summary',
    },
    {
       name: 'infoSummary',
       type: 'string',
       label: 'Info for Summary',
    },
    {
        name: 'typeSummary',
        type: 'select',
        label: 'Field type',
        choices: [
            {
                value: 'text',
                label: "Text bar"
            },
            {
                value: 'textarea',
                label: "Text area"
            },
        ]
    },
    {
        name: 'requiredSummary',
        type: 'boolean',
        label: 'This field is required',
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
       name: 'labelDescription',
       type: 'string',
       label: 'Label for Description',
    },
    {
       name: 'infoDescription',
       type: 'string',
       label: 'Info for Description',
       textarea: true,
    },
    {
       name: 'editorDescription',
       type: 'boolean',
       label: 'Use text editor',
            choices: [
                {
                    value: true,
                    label: "Display"
                },
                {
                    value: false,
                    label: "Hide"
                },
            ]
    },
    {
        name: 'requiredDescription',
        type: 'boolean',
        label: 'This field is required',
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
       name: 'labelImages',
       type: 'string',
       label: 'Label for Images',
    },
    {
       name: 'infoImages',
       type: 'string',
       label: 'Info for Images',
       textarea: true
    },
    {
       name: 'uploadMultiple',
       type: 'boolean',
       label: 'Allow multiple images to be uploaded',
    },
    {
        name: 'requiredImages',
        type: 'boolean',
        label: 'This field is required',
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
       name: 'labelThemes',
       type: 'string',
       label: 'Label for Themes',
    },
    {
       name: 'infoThemes',
       type: 'string',
       label: 'Info for Themes',
       textarea: true

    },
    {
        name: 'requiredThemes',
        type: 'boolean',
        label: 'This field is required',
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
       name: 'labelAreas',
       type: 'string',
       label: 'Label for Areas',
    },
    {
       name: 'infoAreas',
       type: 'string',
       label: 'Info for Areas',
       textarea: true

    },
        {
            name: 'requiredAreas',
            type: 'boolean',
            label: 'This field is required',
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
       name: 'labelLocation',
       type: 'string',
       label: 'Label for Location',
    },
    {
       name: 'infoLocation',
       type: 'string',
       label: 'Info for Location',
       textarea: true

    },
    {
       name: 'displayLocation',
       type: 'boolean',
       label: 'Display Location',
       choices: [
         {
           value: true,
           label: "Display"
         },
         {
           value: false,
           label: "Hide"
         },
       ]
    },
        {
            name: 'requiredLocation',
            type: 'boolean',
            label: 'This field is required',
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
        name: 'labelEstimate',
        type: 'string',
        label: 'Label for Estimate costs',
    },
    {
        name: 'infoEstimate',
        type: 'string',
        label: 'Info for Estimate costs',
        textarea: true

    },
    {
        name: 'typeEstimate',
        type: 'select',
        label: 'Field type',
        choices: [
            {
                value: 'text',
                label: "Text bar"
            },
            {
                value: 'textarea',
                label: "Text area"
            },
        ]
    },
    {
        name: 'minEstimate',
        type: 'float',
        label: 'Minimum number of characters needed for estimate',
    },
    {
        name: 'maxEstimate',
        type: 'float',
        label: 'Maximum number of characters needed for estimate',
    },
    {
        name: 'requiredEstimate',
        type: 'boolean',
        label: 'This field is required',
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
        name: 'displayEstimate',
        type: 'boolean',
        label: 'Display Estimate costs',
        choices: [
            {
                value: true,
                label: "Display"
            },
            {
                value: false,
                label: "Hide"
            },
        ]
    },
    {
        name: 'labelRole',
        type: 'string',
        label: 'Label for Role',
    },
    {
        name: 'infoRole',
        type: 'string',
        label: 'Info for Role',
        textarea: true

    },
    {
        name: 'minRole',
        type: 'float',
        label: 'Minimum number of characters needed for role',
    },
    {
        name: 'maxRole',
        type: 'float',
        label: 'Maximum number of characters needed for role',
    },
    {
        name: 'requiredRole',
        type: 'boolean',
        label: 'This field is required',
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
        name: 'typeRole',
        type: 'select',
        label: 'Field type',
        choices: [
            {
                value: 'text',
                label: "Text bar"
            },
            {
                value: 'textarea',
                label: "Text area"
            },
        ]
    },
    {
        name: 'displayRole',
        type: 'boolean',
        label: 'Display Role',
        choices: [
            {
                value: true,
                label: "Display"
            },
            {
                value: false,
                label: "Hide"
            },
        ]
    },
    {
        name: 'labelPhone',
        type: 'string',
        label: 'Label for Phone number',
    },
    {
        name: 'infoPhone',
        type: 'string',
        label: 'Info for Phone number',
        textarea: true

    },
    {
        name: 'minPhone',
        type: 'float',
        label: 'Minimum number of characters needed for phone',
    },
    {
        name: 'maxPhone',
        type: 'float',
        label: 'Maximum number of characters needed for phone',
    },
    {
        name: 'displayPhone',
        type: 'boolean',
        label: 'Display Phone number',
        choices: [
            {
                value: true,
                label: "Display"
            },
            {
                value: false,
                label: "Hide"
            },
        ]
    },
        {
            name: 'requiredPhone',
            type: 'boolean',
            label: 'This field is required',
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
       name: 'labelAdvice',
       type: 'string',
       label: 'Label for Tip',
    },
    {
       name: 'infoAdvice',
       type: 'string',
       label: 'Info for Tip',
       textarea: true
    },
    {
       name: 'displayAdvice',
       type: 'boolean',
       label: 'Display Tip',
       choices: [
         {
           value: true,
           label: "Display"
         },
         {
           value: false,
           label: "Hide"
         },
       ]
    },
    {
        name: 'minAdvice',
        type: 'float',
        label: 'Minimum number of characters needed for advice',
    },
    {
        name: 'maxAdvice',
        type: 'float',
        label: 'Maximum number of characters needed for advice',
    },
        {
            name: 'requiredAdvice',
            type: 'boolean',
            label: 'This field is required',
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
       name: 'buttonTextSubmit',
       type: 'string',
       label: 'Text for button to submit',
    },
    {
       name: 'buttonTextSave',
       type: 'string',
       label: 'Text for button to save',
    },
];

module.exports = fields;
