apos.define('resource-form-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {
          console.log('createMapcreateMapcreateMap')
            self.createMap(data.mapConfig);

            self.addPolygon(data.mapConfig);
            self.setIdeaMarker(data.mapConfig);
            self.addFormEventListeners(data.mapConfig);
        }
    }
});
