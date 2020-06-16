'use strict';

const config = require('./lib/config');
const MapConfigBuilder = require( './lib/map-data');

module.exports = {
    extend: 'openstad-widgets',
    label: 'Map widgets',
    deferWidgetLoading: false,
    construct: function(self, options) {
        if(config.getMapType() === 'nlmaps-openlayers') {

            self.pushAsset('stylesheet', 'ol', { when: 'always' });
            self.pushAsset('stylesheet', 'openlayers', { when: 'always' });

            self.pushAsset('script', 'modules/ol', { when: 'always' });
            self.pushAsset('script', 'modules/nlmaps', { when: 'always' });
            self.pushAsset('script', 'openlayers/openstad-map', { when: 'always' });
            self.pushAsset('script', 'nlmaps-openlayers', { when: 'always' });
        } else {
            self.pushAsset('script', 'googlemaps/openstad-map', { when: 'always' });
            self.pushAsset('script', 'googlemaps', { when: 'always' });
        }

        const superLoad = self.load;
        self.load = (req, widgets, callback) => {
            widgets.forEach((widget) => {
                widget.mapType = config.getMapType();
            });

            return superLoad(req, widgets, callback);
        }

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
