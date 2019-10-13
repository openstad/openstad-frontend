//var nlMapsHolder = document.getElementById('nlmaps-holder');
//nlMapsHolder.style.height = '400px'; // Change to required height

// Todo: refactor to one interface for every map type

var GeoJSON = ol.format.GeoJSON;
var VectorLayer = ol.layer.Vector;
var VectorSource = ol.source.Vector;
var Style = ol.style.Style;
var Fill = ol.style.Fill;
var Stroke = ol.style.Stroke;
var MultiPoint = ol.geom.MultiPoint;
var Marker = nlmaps.openlayers.markerLayer;
var fromLonLat = ol.proj.fromLonLat;
var View = ol.View;

var OpenlayersMap = {
    map: null,
    marker: null,
    // options: {
    //     style: 'standaard',
    //     target: 'nlmaps-holder-idea-form',
    //     center: {
    //         longitude: openstadMapDefaults.center.lng,
    //         latitude: openstadMapDefaults.center.lat
    //     },
    //     overlay: 'gebouwen',
    //     search: false,
    //     zoom: openstadMapDefaults.zoom
    // },
    initOverviewMap: function(polygonLngLat, markersData) {
        // Todo: refactor this method
        var nlMapsHolder = document.getElementById('nlmaps-holder');

        if (!!nlMapsHolder) {
            nlMapsHolder.style.height = '400px'; // Change to required height

            var markers = [];
            markersData.forEach(function(marker) {
                var feature = new ol.Feature({
                    geometry: new ol.geom.Point(
                        ol.proj.fromLonLat([marker.lng,marker.lat])
                    ), href: marker.href,
                    name: marker.name,
                    category: marker.category
                });

                feature.setStyle(new ol.style.Style({
                    image: new ol.style.Icon({
                        crossOrigin: 'anonymous',
                        anchorOrigin: 'bottom-left',
                        anchor: [0, 0],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        src: marker.markerUrl,
                        offset: [0, 0]
                    }),
                }));
                markers.push(feature);
            });


//Style for polygon
            var styles = [
                new Style({
                    stroke: new Stroke({
                        color: 'black',
                        width: 3
                    }),
                    fill:   new Fill({
                        color: 'rgba(0, 0, 0, 0.1)'
                    })
                }),
                new Style({
                    geometry: function (feature) {
                        // return the coordinates of the first ring of the polygon
                        var coordinates = feature.getGeometry().getCoordinates()[0];
                        return new MultiPoint(coordinates);
                    }
                })
            ];

//transform lnglat array to Spherical Mercator (EPSG:3857)
            var polygonCoords = [];
            polygonLngLat.forEach(function (pointPair) {
                var newPair = ol.proj.fromLonLat([pointPair.lng, pointPair.lat], 'EPSG:3857');
                polygonCoords.push(newPair);
            });

            var geojsonObject = {
                'type':     'FeatureCollection',
                'crs':      {
                    'type':       'name',
                    'properties': {
                        'name': 'EPSG:3857'
                    }
                },
                'features': [{
                    'type':     'Feature',
                    'geometry': {
                        'type':        'Polygon',
                        'coordinates': [polygonCoords]
                    }
                }]
            };

            var source = new VectorSource({
                features: (new GeoJSON()).readFeatures(geojsonObject)
            });

            var layer = new VectorLayer({
                source: source,
                style:  styles
            });

            var opts = {
                style:   'standaard',
                target:  'nlmaps-holder',
                center:  {
                    longitude: 4.2322689,
                    latitude:  52.04946
                },
                overlay: 'gebouwen',
                search:  false,
                zoom:    15.3
            };

//create map
            var map = nlmaps.createMap(opts);
            map.addLayer(layer);

            var vectorSource = new VectorSource({
                features: markers
            });

            var vectorLayer = new VectorLayer({
                source: vectorSource
            });
            map.addLayer(vectorLayer);

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
                var pixel                                             = map.getEventPixel(e.originalEvent);
                var hit                                               = map.hasFeatureAtPixel(pixel, {hitTolerance: 4});
                document.getElementById(map.getTarget()).style.cursor = hit ? 'pointer' : '';
            });

            document.addEventListener("DOMContentLoaded", function () {
                $('.ol-viewport').append($('.nlmaps-geocoder-control-container'));
            });

            $('#themaSelector').change(function (event) {
                vectorSource.clear();
                if (event.target.value == '0') {
                    vectorSource.addFeatures(markers);
                    return;
                }

                markers.forEach(function (feature) {
                    if (feature.getProperties().category === event.target.value) {
                        vectorSource.addFeature(feature);
                    }
                });
            });
        }

        if (!!map && typeof ol != 'undefined' && !!ol) {
// Strg+MouseWheel Zoom
            map.addInteraction(new ol.interaction.MouseWheelZoom({condition: function (e) { return e.originalEvent.ctrlKey }}));

// desktop: normal; mobile: 2-finger pan to start
            map.addInteraction(new ol.interaction.DragPan({
                condition: function (e) {
                    return ol.events.condition.noModifierKeys(e) && (!/Mobi|Android/i.test(navigator.userAgent) || (this.targetPointers && this.targetPointers.length === 2))
                }
            }));

// the quick-changing holder of last touchmove y
            var lastTouchY = null

            var div            = document.getElementById('nlmaps-holder')
            var scrollerBlades = document.scrollingElement || document.documentElement

            if (!!div) {
                div.addEventListener('touchmove', function (e) {
                    e.preventDefault()
                    var touches = e.touches || e.changedTouches
                    // on 1-finger-touchmove, scroll and take note of prev y
                    if (touches.length === 1) {
                        if (lastTouchY !== null) {
                            var by = lastTouchY - touches[0].clientY
                            scrollerBlades.scrollTop += by
                        }
                        lastTouchY = touches[0].clientY
                    }
                })

                // on touchend, reset y
                div.addEventListener('touchend', function (e) { lastTouchY = null });
            }
        }
    },
    init: function () {

        if(markerLocation) {
            this.options.center = {
                longitude: markerLocation.coordinates[1] || openstadMapDefaults.center.lng,
                latitude: markerLocation.coordinates[0] || openstadMapDefaults.center.lat
            }
        }

        this.createMap(this.options);
        this.addPolygon();
        this.setIdeaMarker();

        this.addEventListener();
    },
    setIdeaMarker: function () {
        //Add marker if present
        if (markerLocation) {
            var coordinate = [markerLocation.coordinates[1], markerLocation.coordinates[0]];
            this.addMarker(coordinate);
        }
    },
    createMap: function (options) {
        this.map = nlmaps.createMap(options);

        return this.map;
    },
    addMarker: function (latLong) {
        this.removeMarkers();

        var marker = new ol.Feature({
            geometry: new ol.geom.Point(
                ol.proj.fromLonLat(latLong)
            ),
        });
        marker.setStyle(new ol.style.Style({
            image: new ol.style.Icon(({
                crossOrigin: 'anonymous',
                src: '/img/idea/flag-blue-dh.png',
                size: [25, 25]
            }))
        }));
        var vectorSource = new VectorSource({
            features: [marker]
        });
        var vectorLayer = new VectorLayer({
            source: vectorSource
        });

        this.marker = vectorLayer;

        this.map.addLayer(vectorLayer);
    },
    addEventListener: function () {

        var inside  = function (point, vs) {
            // ray-casting algorithm based on
            // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

            var x = point[0], y = point[1];

            var inside = false;
            for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                var xi = vs[i][0], yi = vs[i][1];
                var xj = vs[j][0], yj = vs[j][1];

                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }

            return inside;
        };

        var polygonCoords = [];
        polygonLngLat.forEach(function (pointPair) {
            var newPair = ol.proj.fromLonLat([pointPair.lng, pointPair.lat], 'EPSG:3857');
            polygonCoords.push(newPair);
        });

        var self = this;
        if (this.marker === null) {
            this.map.on('click', function (event) {

                var pickerCoords = {
                    latitude: event.coordinate[1],
                    longitude: event.coordinate[0]
                };

                var picker = [pickerCoords.longitude, pickerCoords.latitude, ];

                if (inside(picker, polygonCoords)) {
                    var latLong = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
                    var coordinate = {
                        latitude: latLong[1],
                        longitude: latLong[0]
                    };

                    self.addMarker(latLong);

                    var point = {type: 'Point', coordinates: [coordinate.latitude, coordinate.longitude]};
                    var coordinateValue = JSON.stringify(point);

                    editorInputElement.value = coordinateValue;
                }

            }, 'click');
        }
    },
    addPolygon: function () {
        var polygonCoords = [];
        polygonLngLat.forEach(function (pointPair) {
            var newPair = ol.proj.fromLonLat([pointPair.lng, pointPair.lat], 'EPSG:3857');
            polygonCoords.push(newPair);
        });

        var geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:3857'
                }
            },
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [polygonCoords]
                }
            }]
        };

        var source = new VectorSource({
            features: (new GeoJSON()).readFeatures(geojsonObject)
        });

        var styles = [
            new Style({
                stroke: new Stroke({
                    color: 'black',
                    width: 3
                }),
                fill: new Fill({
                    color: 'rgba(0, 0, 0, 0.1)'
                })
            }),
            new Style({
                geometry: function (feature) {
                    // return the coordinates of the first ring of the polygon
                    var coordinates = feature.getGeometry().getCoordinates()[0];
                    return new MultiPoint(coordinates);
                }
            })
        ];

        var layer = new VectorLayer({
            source: source,
            style: styles
        });

        this.map.addLayer(layer);
    },
    removeMarkers: function () {
        this.map.removeLayer(this.marker);
    }
};

/*
document.addEventListener("DOMContentLoaded", function () {
    $('.ol-viewport').append($('.nlmaps-geocoder-control-container'));
});
*/
