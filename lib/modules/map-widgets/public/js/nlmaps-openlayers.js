apos.define('map-widgets', {

    extend: 'apostrophe-widgets',

    afterConstruct: function(self) {

        // Declare ourselves the manager for this widget type
        apos.areas.setWidgetManager(self.name, self);

    },

    construct: function(self, options) {
        console.log('inside openlayers constructor');
    }
});
