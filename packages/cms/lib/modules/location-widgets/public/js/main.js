apos.define('location-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.playAfterlibsLoaded = function($widget, data, options) {
            console.log()
            var map = self.createMap(data.mapConfig);
            self.addPolygon(data.mapConfig);
            self.setIdeaMarker(data.mapConfig);
        }
    }
});
