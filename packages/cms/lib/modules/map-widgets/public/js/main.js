apos.define('map-widgets', {

    extend: 'openstad-widgets',

    afterConstruct: function (self) {

        // Declare ourselves the manager for this widget type
        apos.areas.setWidgetManager(self.name, self);

    },

    construct: function (self, options) {
        self.loadLibs = function ($widget, data, options) {
            if (!window.loadingMapLibs && !window.ol) {
                //prevent loading multiple maps for multiple widgets on one page
                window.loadingMapLibs = true;

                // this beautiful ladder is easiest way to ensure that libs are
                // loaded step by step
                $.getScript("/modules/map-widgets/js/modules/ol.js", function () {
                    $.getScript("/modules/map-widgets/js/openlayers/openstad-map.js", function () {
                        window.loadingMapLibs = false;
                        self.playAfterlibsLoaded($widget, data, options);
                    });
                });

            } else {
                if (window.loadingMapLibs) {
                    // in case multiple maps are loaded on page
                    // make sure scripts only run once
                    setTimeout(function () {
                        self.loadLibs($widget, data, options)
                    }, 25)
                } else {
                    self.playAfterlibsLoaded($widget, data, options);
                }
            }
        }

        self.play = function ($widget, data, options) {
            self.loadLibs($widget, data, options)
        }

        self.playAfterlibsLoaded = function () {
            // run your code in this function
            console.log('playAfterlibsLoaded map widget')
        }

        self.createMap = function (mapConfig) {
            var map = OpenlayersMap.createMap(mapConfig.defaultSettings);
            OpenlayersMap.setDefaultBehaviour(map);
            return map;
        };

        self.center = function (mapConfig) {
            OpenlayersMap.center();
        };


        self.addPolygon = function (mapConfig) {
            return OpenlayersMap.addPolygon(mapConfig.polygon);
        };

        self.addMarkers = function (mapConfig) {

            return OpenlayersMap.addMarkers(mapConfig.markers);
        };

        self.setIdeaMarker = function (mapConfig) {
            const firstMarker = mapConfig.markers && mapConfig.markers[0] ? mapConfig.markers[0] : null;
            return OpenlayersMap.setIdeaMarker(firstMarker);
        }

        self.addFormEventListeners = function (mapConfig) {
            OpenlayersMap.addEventListener(mapConfig.polygon, mapConfig.editorMarkerElement);
        };

        self.addOverviewEventListeners = function (map) {
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
                var hit = map.hasFeatureAtPixel(pixel, {hitTolerance: 4});
                document.getElementById(map.getTarget()).style.cursor = hit ? 'pointer' : '';
            });

            document.addEventListener("DOMContentLoaded", function () {
                $('.ol-viewport').append($('.nlmaps-geocoder-control-container'));
            });
        };

        self.addFilterEventListeners = function (vectorSource, markers) {

            function setMapMarkersFromThemeSelector(val) {
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
