const fields = [
    {
        name: 'redirect',
        type: 'string',
        label: 'Redirect after submit',
        help: 'The url to redirect to after form submit, it\'s possible to redirect to newly created item (replace with correct url) /pagename/:id   ',
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
                value: 'order',
                label: "Checkout (default)"
            },
            {
                value: 'order-minimum',
                label: "Checkout minimum (default)"
            },
            {
                value: 'user',
                label: "User form (default)"
            },
            {
                value: 'dynamic',
                label: "Dynamic",
                showFields: ['dynamicFormSections']
            },
            {
                value: 'repeatable',
                label: "Repeatable",
                showFields: ['dynamicFormSections']
            },
        ]
    },
    {
        name: 'appendFormFields',
        label: 'Append form fields?',
        type: 'boolean',
        choices: [
            {
                label: 'Yes',
                value: true,
                showFields: ['dynamicFormSections']
            },
            {
                label: 'No',
                value: false,
            }
        ],
        def: false,

    },
    {

        name: 'displayUserPasswordField',
        label: 'DisplayUserPasswordField? (only working for user form)',
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
        name: 'allowGuestFormSubmission',
        label: 'Allow guest form submissions?',
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
        name: 'autoSubmitForm',
        label: 'Auto submit form?',
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
        name: 'autoSubmitForm',
        label: 'Auto submit form?',
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
        name: 'displayUserInfoAtTop',
        label: 'Display user info at the top?',
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
        def: true
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
                                showFields: ['fieldKey', 'fieldRequired', 'fieldOptions', 'notExtraDataKey', 'isConfigKey']
                            },
                            {
                                value: 'text',
                                label: "Text",
                                showFields: ['fieldKey', 'fieldRequired', 'fieldMin', 'fieldMax', 'notExtraDataKey', 'isConfigKey']
                            },
                            {
                                value: 'hidden',
                                label: "Hidden",
                                showFields: ['fieldKey', 'fieldValue', 'notExtraDataKey', 'isConfigKey']
                            },
                            {
                                value: 'textarea',
                                label: "Textarea",
                                showFields: ['fieldKey', 'fieldRequired', 'fieldMin', 'fieldMax', 'notExtraDataKey', 'isConfigKey']
                            },
                            {
                                value: 'tags',
                                label: "Tags (currently only works for ideas)",
                                showFields: ['fieldKey', 'fieldRequired', 'fieldMin', 'fieldMax']
                            },
                            {
                                value: 'price',
                                label: "Price",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'raw',
                                label: "Raw",
                                showFields: ['rawInput']
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
                                label: "Image",
                                showFields: ["uploadMultiple", "requiredImages"]
                            },
                            {
                                value: 'map',
                                label: "Map"
                            },
                            {
                                value: 'phone',
                                label: "Idea: Phone"
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
                                value: 'name',
                                label: "Name"
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
                            {
                                value: 'userFirstName',
                                label: "User: Firstname",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'userLastName',
                                label: "User: Lastname",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'userPostcode',
                                label: "User: Postcode",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'function',
                                label: "User: function",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'expertise',
                                label: "User: expertise",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'userPhone',
                                label: "User: phone",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'bio',
                                label: "User: biography",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'image',
                                label: "User: profile image",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'neighborhood',
                                label: "User: neighborhood",
                                showFields: ['fieldRequired']
                            },
                            {
                                value: 'userIsPublic',
                                label: "User: public status",
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
                        name: 'fieldInfo',
                        type: 'string',
                        label: 'Info',
                    },
                    {
                        name: 'fieldValue',
                        type: 'string',
                        label: 'Default value (will be overwritten by url and resource value)',
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
                        name: 'rawInput',
                        label: 'Raw input',
                        type: 'string',
                        textarea: true
                    },
                    {
                        name: 'isConfigKey',
                        label: 'Save field in config',
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
                        name: 'configKey',
                        label: 'What key to save the config under',
                        type: 'string',
                    },
                    {
                        name: 'configSubKey',
                        label: 'What sub key to save the config under',
                        type: 'string',
                    },
                    {
                        name: 'notExtraDataKey',
                        label: 'Save field in root if data object and not in extraData, will only work if column exists in database)',
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
                        name: 'onlyForModerator',
                        label: 'Only show to moderators',
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
        name: 'displayBudget',
        type: 'boolean',
        label: 'Display budget for moderators?',
        def: false
    },
    {
        name: 'agreedRequired',
        type: 'boolean',
        label: 'Display agreed checkbox?',
        def: false
    },
    {
        name: 'agreedLabel',
        type: 'string',
        label: 'Text for checkbox (html allowed)',
        textarea: true
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
