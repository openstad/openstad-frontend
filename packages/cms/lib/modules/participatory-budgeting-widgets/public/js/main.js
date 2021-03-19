apos.define('participatory-budgeting-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.playAfterlibsLoaded = function($widget, data, options) {
            alert('3333');
            self.libsLoaded = true;

            $('body').on('openGridder', function () {
                alert('aaa')
                self.initMap();
            });
        }

        self.initMap = function () {
            var $mapContainer = $('.map-container');

            if ($mapContainer) {
                var map = self.createMap({
                    target: $mapContainer.attr('id'),
                });

                self.setIdeaMarker({
                    lng: $mapContainer.attr('data-marker-lat'),
                    lat: $mapContainer.attr('data-marker-lng'),
                });

                // center map
                self.center();
            }
        }
    }
});
