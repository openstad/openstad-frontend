apos.define('map-widgets', {

    extend: 'apostrophe-widgets',

    afterConstruct: function(self) {

        // Declare ourselves the manager for this widget type
        apos.areas.setWidgetManager(self.name, self);

    },
    construct: function(self, options) {

        self.createMap = function(mapConfig) {
            var map = new GoogleMaps(
                mapConfig.markerStyles,
                mapConfig.polygon,
                mapConfig.editorMarkerElement,
                mapConfig.editorMarker
            );

            map.createMap(mapConfig.defaultSettings, mapConfig.markers, mapConfig.polygon);

            return map;
        };

        self.setIdeaMarker = function(mapConfig) {

        };

        self.addPolygon = function(mapConfig) {

        };

        self.addMarkers = function(mapConfig) {

        };

        self.addEventListeners = function(map, vectorSource, markers) {

        }
    }
});
