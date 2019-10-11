apos.define('idea-map-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {
            console.log('inside idea map widget context play function');
        };
    }
});
