apos.define('idea-form-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {
            var mapConfig = resourceMapConfig ? resourceMapConfig : {};
            self.createMap(mapConfig);
            self.addPolygon(mapConfig);
            self.setIdeaMarker(mapConfig);
            self.addFormEventListeners(mapConfig);
        }
    }
});
