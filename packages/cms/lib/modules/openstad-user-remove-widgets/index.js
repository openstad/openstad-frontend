/**
 * Widget for user removing it's data
 * To edit
 */

const fields = [

]

module.exports = {
    extend: 'openstad-widgets',
    label: 'User remove form',
    addFields: fields,
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
            return superOutput(widget, options);
        };

    }
};
