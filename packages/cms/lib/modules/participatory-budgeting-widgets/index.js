const sortingOptions = require('../../../config/sorting.js').options;
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const fields = require('./lib/fields.js');
const ideaStates = require('../../../config/idea.js').states;

module.exports = {
    extend: 'map-widgets',
    label: 'Begroot',
    addFields: fields,
    construct: function (self, options) {
        options.arrangeFields = (options.arrangeFields || []).concat([
            {
                name: 'voting-options',
                label: 'Voting options',
                fields: ['voting', 'votingType', 'maxIdeas', 'minIdeas', 'initialAvailableBudget', 'minimalBudgetSpent']
            },
            {
                name: 'display-options',
                label: 'Display options',
                fields: ['displayRanking', 'displayBudgetLabel', 'showVoteCount', 'unavailableButton','displayOriginalIdeaUrl', 'originalIdeaUrl']
            },
            {
                name: 'sorting-options',
                label: 'Sorting options',
                fields: ['selectedSorting', 'defaultSorting']
            },
            {
                name: 'explanation-texts',
                label: 'Explanation texts',
                fields: ['step_1_intro', 'step_2_intro', 'step_3_intro', 'step_3_succesfull_auth', 'thankyou_message', 'showNewsletterButton', 'newsletterButtonText']
            },
            {
                name: 'authentication',
                label: 'Authentication',
                fields: ['authEmbeddedForm', 'authFormUniqueCodelabel', 'authFormUniqueCodeButtonText', 'authFormSmslabel' , 'authFormSmsButtonText', 'authFormUrllabel', 'authFormUrlButtonText', 'scrollBackToBudgetBlock']
            },
            {
                name: 'labels',
                label: 'Labels',
                fields: [].concat(
                  ideaStates.map((state) => {
                    return'label' +  state.value
                }))
            },
        ]);

        const superPushAssets = self.pushAssets;
        self.pushAssets = function () {
            superPushAssets();
            self.pushAsset('stylesheet', 'main', {when: 'always'});
            self.pushAsset('stylesheet', 'overview', {when: 'always'});
            self.pushAsset('stylesheet', 'steps', {when: 'always'});
            self.pushAsset('stylesheet', 'helpers', {when: 'always'});
            self.pushAsset('stylesheet', 'mobile-accordion', {when: 'always'});
            self.pushAsset('stylesheet', 'end-date-bar', {when: 'always'});
            self.pushAsset('stylesheet', 'budget-block', {when: 'always'});
            self.pushAsset('stylesheet', 'button-vote', {when: 'always'});
            self.pushAsset('stylesheet', 'button-add', {when: 'always'});
            self.pushAsset('stylesheet', 'sticky', {when: 'always'});
            self.pushAsset('stylesheet', 'gridder', {when: 'always'});
            self.pushAsset('script', 'sticky', {when: 'always'});
            self.pushAsset('script', 'accordion', {when: 'always'});
            self.pushAsset('script', 'jquery.gridder', {when: 'always'});
            self.pushAsset('script', 'ideas-lister', {when: 'always'});
            self.pushAsset('script', 'find-polyfill', {when: 'always'});
            self.pushAsset('script', 'voting', {when: 'always'});
            self.pushAsset('script', 'westbegroot-enhancements', {when: 'always'});
            self.pushAsset('script', 'main', {when: 'always'});
        };

        const superOutput = self.output;

        self.output = function (widget, options) {
            const siteConfig = options.siteConfig;
            // add voting helpers
            widget.isVotingActive = siteConfig && siteConfig.votes && siteConfig.votes.isActive ? siteConfig.votes.isActive : false;
            widget.voteType = siteConfig && siteConfig.votes && siteConfig.votes.voteType ? siteConfig.votes.voteType : '';
            widget.isVoteCountPublic = siteConfig && siteConfig.votes && siteConfig.votes.isViewable ? siteConfig.votes.isViewable : false;

            // add the label to the select sort options for displaying in the select box
            widget.selectedSorting = widget.selectedSorting ? widget.selectedSorting.map((sortingValue) => {
                const sortingOption = sortingOptions.find(sortingOption => sortingOption.value === sortingValue);
                return {
                    value: sortingValue,
                    label: sortingOption ? sortingOption.label : sortingValue
                }
            }) : [];

            widget.formatImageUrl = function (url, width, height, crop, location) {
                if (url) {
                    url = url + '/:/rs=w:' + width + ',h:' + height;
                    url = crop ? url + ';cp=w:' + width + ',h:' + height : url;
                } else {
                    url = '/modules/openstad-assets/img/placeholders/idea.jpg';
                }

                return url;
            }

            widget.userHasVoted = false;
            widget.userIsLoggedIn = false;

            // in case the it's empty set to true
            // for backwards compatibility
            if (widget.displayOriginalIdeaUrl !== false) {
                widget.displayOriginalIdeaUrl = true;
            }


            return superOutput(widget, options);
        };
    }
};
