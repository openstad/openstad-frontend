apos.define('resource-form-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {
            var mapConfig = typeof resourceMapConfig !== 'undefined' && resourceMapConfig ? resourceMapConfig : {};
            self.createMap(mapConfig);

            self.addPolygon(mapConfig);
            console.log('mapConfig', mapConfig)
            self.setIdeaMarker(mapConfig);
            self.addFormEventListeners(mapConfig);
        }
    }
});
