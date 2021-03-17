/**
 * Abstract map widget, is extended by several other map widgets
 * Used to offer implementation with Google Maps and Openlayers with NLmaps.
 *
 * In future will move the Openstad react maps
 */
'use strict';

const MapConfigBuilder = require('./lib/map-data');

module.exports = {
    extend: 'openstad-widgets',
    label: 'Map widgets',
    deferWidgetLoading: false,
    construct: function(self, options) {
        const superPushAssets = self.pushAssets;

        self.pushAssets = function() {
            superPushAssets();
            self.pushAsset('stylesheet', 'ol', { when: 'always' });
            self.pushAsset('stylesheet', 'openlayers', { when: 'always' });
            // openlayers lib is loaded async because of it's size
            // including it would be an exta 500kb of JS on every page request
            self.pushAsset('script', 'main', { when: 'always' });
        };

        self.getMapConfigBuilder = (globalData) => {
            // set the absolute url of uploaded image before it goes to the client side code.
            if (globalData.themes && globalData.themes.length > 0) {
              globalData.themes = globalData.themes.map((theme) => {
                if (theme.mapUploadedFlag) {
                  theme.mapUploadedFlagUrl = self.apos.attachments.url(theme.mapUploadedFlag);
                }

                return theme;
              });
            }

            return new MapConfigBuilder(globalData);
        }
    }
};
