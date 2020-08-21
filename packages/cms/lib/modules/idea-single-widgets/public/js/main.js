apos.define('idea-single-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {
            var mapConfig = resourceMapConfig && resourceMapConfig ? resourceMapConfig : {};
            var map = self.createMap(mapConfig);

            self.addPolygon(mapConfig);
            self.setIdeaMarker(mapConfig);
        }
    }
});
