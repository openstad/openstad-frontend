apos.define('map-widgets', {

    extend: 'openstad-widgets',

    afterConstruct: function(self) {

        // Declare ourselves the manager for this widget type
        apos.areas.setWidgetManager(self.name, self);

    },

    construct: function(self, options) {

        self.createMap = function(mapConfig) {
            var map = OpenlayersMap.createMap(mapConfig.defaultSettings);
            OpenlayersMap.setDefaultBehaviour(map);
            return map;
        };

        self.addPolygon = function(mapConfig) {
            return OpenlayersMap.addPolygon(mapConfig.polygon);
        };

        self.addMarkers = function(mapConfig) {
            return OpenlayersMap.addMarkers(mapConfig.markers);
        };

        self.setIdeaMarker = function(mapConfig) {
            return OpenlayersMap.setIdeaMarker(mapConfig.markers[0] || null);
        }

        self.addFormEventListeners = function(mapConfig) {
            OpenlayersMap.addEventListener(mapConfig.polygon, mapConfig.editorMarkerElement);
        };

        self.addOverviewEventListeners = function(map) {
            map.on('click', function (evt) {
                var feature = map.forEachFeatureAtPixel(evt.pixel,
                    function (feature) {

                        return feature.getProperties().href ? feature : null;
                    }, {hitTolerance: 4});

                if (feature) {
                    window.location.href = feature.getProperties().href;
                }
            });

            // change mouse cursor when over marker
            map.on('pointermove', function (e) {
                var pixel = map.getEventPixel(e.originalEvent);
                var hit                                               = map.hasFeatureAtPixel(pixel, {hitTolerance: 4});
                document.getElementById(map.getTarget()).style.cursor = hit ? 'pointer' : '';
            });

            document.addEventListener("DOMContentLoaded", function () {
                $('.ol-viewport').append($('.nlmaps-geocoder-control-container'));
            });
        };
        
        self.addFilterEventListeners = function(vectorSource, markers) {
            
            function setMapMarkersFromThemeSelector (val) {
                vectorSource.clear();
                if (val === '0') {
                    vectorSource.addFeatures(markers);
                    return;
                }

                markers.forEach(function (feature) {
                    if (feature.getProperties().category === val) {
                        vectorSource.addFeature(feature);
                    }
                });
            }
            
            $('#themaSelector').change(function (event) {
                setMapMarkersFromThemeSelector(event.target.value);
            });
            
            // Set markers based on theme selector on load
            // This is useful when the user has selected a filter and reloads the page, this way we ensure that
            // the marker we show line up with the ideas we show
            setMapMarkersFromThemeSelector($('#themaSelector').val());
            
            $(document).on('updateIdeaOverviewDisplay', function () {
                setMapMarkersFromThemeSelector($('#themaSelector').val());
            });
        }
    }
});
