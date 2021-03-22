apos.define('participatory-budgeting-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        var maps = [];

        $('body').on('openGridder', function () {
            console.log('self.openGridder', self.openGridder);
            maps.forEach(function (map) {
                console.log('openGridder.map', map);

                map.updateSize();
            });
        });

        self.playAfterlibsLoaded = function($widget, data, options) {
            alert('oplayAfterlibsLoadedpwn', self.createMap)

            self.loadedLibs = true;

            var $mapContainer = $('.map-container');

            $mapContainer.each(function () {
                var $mappy = $(this);

                console.log('$mappy.attr(\'id\')', $mappy.attr('id'))

                var map = self.createMap({
                    defaultSettings: {
                        target: $mappy.attr('id'),
                    }
                });

                var marker = {
                    name: 'marker',
                    position: {
                        lng: $mappy.attr('data-marker-lat'),
                        lat: $mappy.attr('data-marker-lng'),
                    },
                    icon : {
                        url: '/modules/openstad-assets/img/idea/flag-red.png',
                        size: [22, 24],
                        anchor: [4, 21],
                    }
                }

                self.setIdeaMarker({
                    markers: [marker]
                });

                // center map
                self.center();

                maps.push(map);
            })
        }

        self.initMap = function () {
            var $mapContainer = $('.map-container');

            if ($mapContainer.length > 0) {
                console.log('$mapContainer 333', self.createMap)



            }
        }
    }
});
