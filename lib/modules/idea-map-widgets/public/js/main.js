apos.define('idea-map-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        console.log(self, options);
        self.play = function($widget, data, options) {
            self.createMap(data.mapConfig);
        }
    }
});
