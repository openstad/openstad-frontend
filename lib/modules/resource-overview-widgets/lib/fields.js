const ideaStates      = require('../../../../config/idea.js').states;
const sortingOptions  = require('../../../../config/sorting.js').apiOptions;

module.exports = [
      {
        name: 'displayType',
        label: 'Type ',
        type: 'select',
        choices: [
          {
            label: 'Minimum stemmen (stemvan type)',
            value: 'minimalVotes',
          },
          {
            label: 'Uitklap',
            value: 'gridder',
            showFields: ['gridder_text_open', 'gridder_text_vote_button', 'gridder_open_text_vote_button', 'gridder_tile_image_aspect_ratio', 'gridder_use_field_as_title', 'showVoteCounter']
          },
          {
            label: 'Row',
            value: 'row',
          },
          {
            label: 'Raw (activeResource is the variable)',
            value: 'raw',
          },
        ]
      },
      {
        name: 'fallBackToMapImage',
        label: 'Fall back to map image if no image available?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true,
            showFields: []
          },
          {
            label: 'No',
            value: false,
          }
        ]
      },
      {
        name: 'displayPagination',
        label: 'Display pagination',
        type: 'boolean',
      },
      {
        name: 'pathForResource',
        label: 'Url structure for the resource (for instance /article, the code turns that into /article/10)',
        type: 'string',
      },

      {
        name: 'defaultImage',
        type: 'attachment',
        label: 'Default image',
        trash: true
      },
      {
        name: 'showVoteCounter',
        label: 'Show vote counter (for gridder)',
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
        ]
      },
      {
        name: 'displayRanking',
        label: 'Display ranking',
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
        ]
      },
      {
        name: 'amountCharsSummary',
        label: 'Amount of characters for the summary',
        type: 'string',
        def: '60'
      },
      {
        name: 'rawInput',
        label: 'Raw input',
        type: 'string',
        textarea: true
      },

      {
        name: 'gridder_text_open',
        label: 'Text for hover on image',
        type: 'string'
      },
      {
        name: 'gridder_tile_image_aspect_ratio',
        label: 'Aspect ratio of images in tiles',
        type: 'string',
        def: '1:1',
      },
      {
        name: 'gridder_use_field_as_title',
        label: 'Which field should be used as title for an idea',
        type: 'string',
        def: 'title',
      },
      {
        type: 'checkboxes',
        name: 'selectedSorting',
        label: 'Select sorting available (check one or more)',
        choices: sortingOptions
      },
      {
        type: 'select',
        name: 'defaultSorting',
        label: 'Select the default sorting (needs to be checked)',
        choices: sortingOptions
      },
      {
        type: 'string',
        name: 'filterResources',
        label: 'Show only following ideas: (idea id\'s, comma seperated)',
      },
      {
        type: 'string',
        name: 'pageSize',
        label: 'Amount of items per page',
        help: "There is a max of 100 per page"
      },
      {
        name: 'filterClassName',
        type: 'select',
        label: 'Select styling class for filter and sorting',
        choices: [
          {
            label: 'Default',
            value: 'filterDefault',
          },
          {
            label: 'Clean',
            value: 'filterClean',
          },
        ]
      },
      {
        name: 'displaySorting',
        label: 'Display sorting',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
      },
      {
        name: 'displayThemeFilter',
        label: 'Display theme filter?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
      },
      {
        name: 'displayAreaFilter',
        label: 'Display area filter?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
      },
      {
        name: 'displayTagFilters',
        label: 'Display tag filters?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
      },
      {
        name: 'displaySorting',
        label: 'Display sorting',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
      },
      {
        name: 'displaySearch',
        label: 'Display search?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
      },
      {
        type: 'string',
        name: 'filterExcludeThemes',
        label: 'Exclude ideas with this theme'
      },
      {
        type: 'string',
        name: 'filterIncludeThemes',
        label: 'Only show idea including this theme (currently only works with one theme)'
      },
      {
        type: 'string',
        name: 'filterIdeas',
        label: 'Show only following ideas: (idea id\'s, comma seperated)',
        help: 'Warning: This currently  doesn\'t work with sorting, filters and pagination. For multiple theme names, comma seperated'
      },
      {
        type: 'string',
        name: 'resultCountText',
        label: 'Text for amount of results',
        help: 'Example: You are seeing <b>[visibleCount]</b> of in total [totalCount] articles'
      },
      {
        type: 'string',
        name: 'searchText',
        label: 'Text for active search result',
        help: 'Example: You are seeing search results for [searchTerm]'
      },
      {
        type: 'boolean',
        name: 'allowVotingInOverview',
        label: 'Allow for voting on ideas directly in overview',
        help: 'Note: currently only works for minimalVotes and for idea with status open'
      },
    ].concat(
      ideaStates.map((state) => {
        return {
          type: 'string',
          name: 'label' +  state.value,
          label: 'Label for: ' + state.value,
        }
      })
  );
