apos.define('map-widgets', {

    extend: 'apostrophe-widgets',

    afterConstruct: function(self) {

        // Declare ourselves the manager for this widget type
        apos.areas.setWidgetManager(self.name, self);

    },
    construct: function(self, options) {

        self.createMap = function(mapConfig) {
            var map = new GoogleMaps(
                mapConfig.openstadMapMarkerstyles,
                mapConfig.openstadMapPolygon,
                null,
                null
            );

            map.createMap(mapConfig.openstadMapDefaults, mapConfig.selectedMarkers, mapConfig.openstadPolygons);
        };

        self.addPolygon = function(options) {

        };

    }
});
