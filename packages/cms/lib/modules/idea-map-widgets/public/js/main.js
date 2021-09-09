apos.define('idea-map-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.playAfterlibsLoaded = function($widget, data, options) {
            var mapConfig = typeof resourceMapConfig !== 'undefined' && resourceMapConfig ? resourceMapConfig : data.mapConfig;

            if (mapConfig) {
                var map = self.createMap(mapConfig);
                self.addPolygon(mapConfig);

                var markers = self.addMarkers(mapConfig);
                self.addOverviewEventListeners(map);

                if(mapConfig.defaultSettings && mapConfig.defaultSettings.autoCenter) {
                    self.center();
                }
            }

            /**
             * This is meant to filter the markers based on category
             * This is however not re-implemented at the moment
             * The preferable solutions would however be different:
             * This is move this whole widget to resource overview,
             * and use the server side query directly
             */
            //if (markers) {
            //    self.addFilterEventListeners(markers.vectorSource, markers.items);
            //}
        }
    }
});
