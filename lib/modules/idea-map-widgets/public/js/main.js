apos.define('idea-map-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {
            var map = self.createMap(data.mapConfig);
            self.addPolygon(data.mapConfig);
            var markers = self.addMarkers(data.mapConfig);
            self.addOverviewEventListeners(map);
            if (markers) {
                self.addFilterEventListeners(markers.vectorSource, markers.items);
            }
        }
    }
});
