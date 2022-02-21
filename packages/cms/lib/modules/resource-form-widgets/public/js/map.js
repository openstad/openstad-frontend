apos.define('resource-form-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.playAfterlibsLoaded = function($widget, data, options) {
            var mapConfig = typeof resourceMapConfig !== 'undefined' && resourceMapConfig ? resourceMapConfig : data.mapConfig;

            if (mapConfig) {
                self.createMap(mapConfig);
                self.addPolygon(mapConfig);
                self.setIdeaMarker(mapConfig);
                self.addFormEventListeners(mapConfig);
                self.center();
            }
        }
    }
});
