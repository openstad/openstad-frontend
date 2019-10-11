const config = require('./lib/config');

module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Map widgets',
    deferWidgetLoading: false,
    construct: function(self, options) {
        if(config.getMapType() === 'nlmaps-openlayers') {
            self.pushAsset('script', 'nlmaps-openlayers', { when: 'always' });
        } else {
            self.pushAsset('script', 'googlemaps', { when: 'always' });
        }
    }
};
