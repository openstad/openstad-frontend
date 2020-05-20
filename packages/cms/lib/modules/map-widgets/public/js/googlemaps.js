apos.define('map-widgets', {

    extend: 'openstad-widgets',

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

            map.createMap(mapConfig.defaultSettings, mapConfig.markers, mapConfig.polygon, mapConfig.defaultSettings.googleMapsApiKey);

            return map;
        };

        self.setIdeaMarker = function(mapConfig) {

        };

        self.addPolygon = function(mapConfig) {

        };

        self.addMarkers = function(mapConfig) {

        };

        self.addFormEventListeners = function(mapConfig) {

        };

        self.addOverviewEventListeners = function(map, vectorSource, markers) {

        };

        self.addFilterEventListeners = function(map, vectorSource, markers) {

        };
    }
});
