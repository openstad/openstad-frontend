apos.define('apostrophe-areas-editor', {
    construct: function(self, options) {
        self.enableInterval = function() {
            // set saveInterval to 1 sec instead of the default 5 seconds.
            self.saveInterval = setInterval(self.onInterval, 1000);
        };
    }
});
