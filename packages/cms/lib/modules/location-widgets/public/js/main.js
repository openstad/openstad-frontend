apos.define('location-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {
            var map = self.createMap(data.mapConfig);
            self.addPolygon(data.mapConfig);
            self.setIdeaMarker(data.mapConfig);
        }
    }
});
