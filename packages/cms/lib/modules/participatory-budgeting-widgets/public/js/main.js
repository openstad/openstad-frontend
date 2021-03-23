
apos.define('participatory-budgeting-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        var maps = [];

        $('body').on('openGridder', function () {

            console.log('self.openGridder');

            setTimeout(function() {
                maps.forEach(function (map) {
                    console.log('mappp', map)
                    map.render();
                });
                self.initMaps();
            }, 300);

        });

        $('body').on('closeGridder', function () {});

        self.initMaps = function () {
                self.initiatedMaps = true;

                var $mapContainer = $('.map-container');

                $mapContainer.each(function (ev) {
                    var $mappy = $(this);

                    var mapLoaded = $mappy.attr('data-map-loaded');

                    if (true || !mapLoaded) {
                        $mappy.empty();

                        var map = self.createMap({
                            defaultSettings: {
                                target: $mappy.get(0),
                                 zoom: 12,
                                 minZoom: 12,
                                 maxZoom:10,
                                 center: {
                                    lat:  parseFloat($mappy.attr('data-marker-lat')),
                                    lng: parseFloat($mappy.attr('data-marker-lng'))
                                 },
                            }
                        });

                        $mappy.attr('data-map-loaded', map)

                        var markerData = {
                            name: 'marker',
                            position: {
                                lng:parseFloat($mappy.attr('data-marker-lng')),
                                lat:  parseFloat($mappy.attr('data-marker-lat')),
                            },
                            icon: {
                                url: '/modules/openstad-assets/img/idea/flag-red.png',
                                size: [22, 24],
                                anchor: [4, 21],
                            }
                        }

                        var marker = new ol.Feature({
                            geometry: new ol.geom.Point(
                                ol.proj.fromLonLat([markerData.position.lng, markerData.position.lat])
                            ),
                        });
                        console.log('Add marker', ol.proj.fromLonLat([markerData.position.lng, markerData.position.lat]))

                        console.log('Add marker', marker)

                        marker.setStyle(new ol.style.Style({
                            image: new ol.style.Icon(({
                                crossOrigin: 'anonymous',
                                src: markerData.icon.url,
                                anchor: [0, 0],
                                size: markerData.icon.size
                            }))
                        }));


                        var vectorSource = new ol.source.Vector({
                            features: [marker]
                        });

                        console.log('Add marker vectorSource', vectorSource)


                        var vectorLayer = new ol.layer.Vector({
                            source: vectorSource
                        });


                        map.addLayer(vectorLayer);

                        // center map
                       // self.center();

                        maps.push(map);
                    }
                });
            }
        }
});
