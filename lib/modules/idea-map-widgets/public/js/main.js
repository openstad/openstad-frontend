apos.define('idea-map-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {
            const map = self.createMap(data.mapConfig);
            self.addPolygon(data.mapConfig);
            const markers = self.addMarkers(data.mapConfig);
            self.addEventListeners(map, markers.vectorSource, markers.items);

        }
    }
});
