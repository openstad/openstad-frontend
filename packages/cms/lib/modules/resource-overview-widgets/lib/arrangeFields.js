const ideaStates      = require('../../../../config/idea.js').states;

module.exports = (self, options) => {
    options.arrangeFields = (options.arrangeFields || []).concat([
        {
            name: 'general',
            label: 'General',
            fields: ['resource', 'voting', 'displayType', 'rawInput', 'pathForResource', 'displayRanking', 'allowVotingInOverview']
        },
        {
            name: 'imageSettings',
            label: 'Image settings',
            fields: ['defaultImage', 'gridder_tile_image_aspect_ratio']
        },
        {
            name: 'displaySettings',
            label: 'Display settings',
            fields: ['displayTitle', 'displayRanking', 'displayLabel', 'displaySummary', 'displayDescription', 'displayVoteProgressBar', 'displayVoteForCount', 'displayVoteAgainstCount', 'displayArgumentsCount', 'displayTheme', 'displayArea', 'showVoteCounter', 'displayShareButtons', 'displayEditLinkForModerator', 'editUrl', 'displayVoteCaption', 'voteCaption']
        },
        {
            name: 'gridder',
            label: 'Button and Title text',
            fields: ['gridder_text_open', 'gridder_text_vote_button', 'gridder_open_text_vote_button', 'gridder_use_field_as_title']
        },
        {
            name: 'styling',
            label: 'Styling',
            fields: ['cardStyle', 'className']
        },
        {
            name: 'sorting',
            label: 'Sorting',
            fields: ['displaySorting', 'displayFilterVoting', 'defaultSorting', 'selectedSorting', 'filterClassName']
        },
        {
            name: 'pagination',
            label: 'Pagination',
            fields: ['displayPagination', 'pageSize', 'resultCountText']
        },
        {
            name: 'theme',
            label: 'Theme',
            fields: ['displayThemeFilter']
        },
        {
            name: 'area',
            label: 'Area',
            fields: ['displayAreaFilter']
        },
        {
            name: 'search',
            label: 'Search',
            fields: ['displaySearch', 'searchText']
        },
        {
            name: 'tags',
            label: 'Tags',
            fields: ['displayTagFilters']
        },
        
        {
            name: 'targetAudience',
            label: 'Doelgroepen',
            fields: ['displayTargetAudienceFilters']
        },
        {
            name: 'grants',
            label: 'Subsidies',
            fields: ['displayGrantFilters']
        },

        {
            name: 'include_exclude',
            label: 'Include & Exclude items',
            fields: ['filterExcludeThemes', 'filterIncludeThemes', 'filterResources', 'filterArchive']
        },
        {
            name: 'status_labels',
            label: 'Labels',
            fields: ideaStates.map((state) => {
                return 'label' +  state.value
            })
        },

    ]);
}