/**
 * Resource admin widget allows for CRUD buttons
 * To edit
 */
const rp = require('request-promise');
const ideaStates = require('../../../config/idea.js').states;
const extraFields = require('../../../config/extraFields.js').fields;
const resourcesSchema = require('../../../config/resources.js').schemaFormat;

const fields = [
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
        name: 'showEditButton',
        label: 'Show edit button?',
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
        name: 'hideVoteOverview',
        label: 'Hide vote overview?',
        help: 'The vote overview is shown in a popup with a simple table overview after clicking the Vote overview button, this works well until a few thousands votes are present. In that case page load will be slow. Therefore it\'s possible to hide it. If the votes still needs to be edited this can be done under /admin',
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
        name: 'showDeleteButton',
        label: 'Show delete button?',
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
        name: 'redirectUrlAfterDelete',
        label: 'Where to redirect to after delete?',
        type: 'string',
        required: true
    },
    {
        name: 'editUrl',
        label: 'Edit url ',
        type: 'string',
        required: true
    },
]

module.exports = {
    extend: 'openstad-widgets',
    label: 'Recource admin buttons',
    addFields: fields,
    beforeConstruct: function (self, options) {
        if (options.resources) {
            self.resources = options.resources;

            options.addFields = [
                {
                    type: 'select',
                    name: 'resource',
                    label: 'Resource (from config)',
                    choices: options.resources
                }
            ].concat(options.addFields || [])
        }
    },
    construct: function (self, options) {
        let classIdeaId;

        require('./lib/routes.js')(self, options);

        const superPushAssets = self.pushAssets;
        self.pushAssets = function () {
            superPushAssets();
            self.pushAsset('stylesheet', 'main', {when: 'always'});
            self.pushAsset('script', 'main', {when: 'always'});
        };

        const superOutput = self.output;
        self.output = function (widget, options) {
            widget.pageType = options.pageType;
            widget.activeResource = options.activeResource ? options.activeResource : {};
            widget.activeResourceId = options.activeResource ? options.activeResource.id : false;
            widget.activeResourceType = options.activeResourceType;

            const resourceInfo = resourcesSchema.find((resourceInfo) => resourceInfo.value === widget.activeResourceType);

            widget.activeResourceEndpoint = options.activeResourceType;

            widget.extraFields = extraFields;


            return superOutput(widget, options);
        };

    }
};
