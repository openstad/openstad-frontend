apos.define('idea-map-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {
            var mapConfig = resourceMapConfig ? resourceMapConfig : {};

            var map = self.createMap(mapConfig);
            self.addPolygon(mapConfig);
            var markers = self.addMarkers(mapConfig);
            self.addOverviewEventListeners(map);
            if (markers) {
                self.addFilterEventListeners(markers.vectorSource, markers.items);
            }            
        }
    }
});
