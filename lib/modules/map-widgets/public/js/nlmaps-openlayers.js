apos.define('map-widgets', {

    extend: 'apostrophe-widgets',

    afterConstruct: function(self) {

        // Declare ourselves the manager for this widget type
        apos.areas.setWidgetManager(self.name, self);

    },

    construct: function(self, options) {

        self.createMap = function(mapConfig) {
            OpenlayersMap.initOverviewMap(mapConfig.polygon, mapConfig.markers);
        };

        self.addPolygon = function(options) {

        };

        self.addMarkers = function(options) {

        };

        self.addEventListener = function(options) {

        };
    }
});
