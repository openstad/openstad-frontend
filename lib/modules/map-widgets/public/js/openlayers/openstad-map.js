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

var OpenlayersMap = {
    map: null,
    marker: null,
    setDefaultBehaviour: function(map) {

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
    setIdeaMarker: function (marker) {
        //Add marker if present
        if (marker && marker.position) {
            var coordinate = [marker.position.lng, marker.position.lat];
            this.addMarker(coordinate, marker.icon);
        }
    },
    createMap: function (settings) {
        var center = settings.center && settings.center? { latitude: settings.center.lat, longitude: settings.center.lng } : { longitude: 4.2322689, latitude:  52.04946}
        var defaultSettings = {
            view: new ol.View({
                center: ol.proj.fromLonLat([center.longitude, center.latitude]),
                zoom:    settings.zoom || 15.3,
                minZoom: settings.minZoom,
                maxZoom: settings.maxZoom
            }),
            target:  'nlmaps-holder',
            search:  false
        };

        this.map = new ol.Map(defaultSettings);

        var layer = nlmaps.openlayers.bgLayer();
        this.map.addLayer(layer);

        var overlayLayer = nlmaps.openlayers.overlayLayer('gebouwen');
        this.map.addLayer(overlayLayer);

        var marker = nlmaps.openlayers.markerLayer(true);
        this.map.addLayer(marker);

        return this.map;
    },
    addMarkers: function(markersData) {
        var markers = [];
        markersData.forEach(function(marker) {
            var feature = new ol.Feature({
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat([marker.position.lng, marker.position.lat])
                ), href: marker.href,
                name: marker.name,
                category: marker.category
            });

            feature.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    crossOrigin: 'anonymous',
                    anchorOrigin: 'bottom-left',
                    anchor: [0, 0],
                    size: marker.icon.size,
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    src: marker.icon.url,
                    offset: [0, 0]
                }),
            }));
            markers.push(feature);
        });

        var vectorSource = new VectorSource({
            features: markers
        });

        var vectorLayer = new VectorLayer({
            source: vectorSource
        });

        this.map.addLayer(vectorLayer);

        return {
            vectorSource: vectorSource,
            items: markers
        };

    },
    addMarker: function (latLong, icon) {
        this.removeMarkers();

        var marker = new ol.Feature({
            geometry: new ol.geom.Point(
                ol.proj.fromLonLat(latLong)
            ),
        });
        marker.setStyle(new ol.style.Style({
            image: new ol.style.Icon(({
                crossOrigin: 'anonymous',
                src: icon.url,
                anchor: [0, 0],
                size: icon.size
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
    addEventListener: function (polygonLngLat, editorInputElement) {
        var editorInputElement = document.getElementById(editorInputElement);
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

                var picker = [pickerCoords.longitude, pickerCoords.latitude ];

                if (inside(picker, polygonCoords)) {
                    var latLong = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
                    var coordinate = {
                        latitude: latLong[1],
                        longitude: latLong[0]
                    };

                    self.addMarker(latLong, {url: '/img/idea/flag-blue.png', size: [22, 24]});

                    var point = {type: 'Point', coordinates: [coordinate.latitude, coordinate.longitude]};

                    editorInputElement.value = JSON.stringify(point);
                }

            }, 'click');
        }
    },
    addPolygon: function (polygonLngLat) {
        this.map.addLayer(buildInvertedPolygon(polygonLngLat));
        this.map.addLayer(buildOutlinedPolygon(polygonLngLat));
    },
    removeMarkers: function () {
        this.map.removeLayer(this.marker);
    }
};

function getInvertCoordinates() {

    var coordinates = [{"lng": 0, "lat": 90},{"lng": 180, "lat": 90},{"lng": 180, "lat": -90},{"lng": 0, "lat": -90},{"lng": -180, "lat": -90},{"lng": -180, "lat": 0},{"lng": -180, "lat": 90},{"lng": 0, "lat": 90}];

    var invertCoords = [];
    coordinates.forEach(function (pointPair) {
        var newPair = ol.proj.fromLonLat([pointPair.lng, pointPair.lat], 'EPSG:3857');
        invertCoords.push(newPair);
    });

    return invertCoords;
}

function createInvertedGeojsonObject(coordinates) {
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
                'coordinates': [getInvertCoordinates(), coordinates]
            }
        }]
    };

    return geojsonObject;
}

function createGeojsonObject(coordinates) {
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
                'coordinates': [coordinates]
            }
        }]
    };

    return geojsonObject;
}

function getTransformedPolygon(polygonLngLat) {
    //transform lnglat array to Spherical Mercator (EPSG:3857)
    var polygonCoords = [];
    polygonLngLat.forEach(function (pointPair) {
        var newPair = ol.proj.fromLonLat([pointPair.lng, pointPair.lat], 'EPSG:3857');
        polygonCoords.push(newPair);
    });

    return polygonCoords;
}


function buildOutlinedPolygon(polygonLngLat) {
    //Style for the outlined polygon
    var outlineStyles = [
        new Style({
            stroke: new Stroke({
                color: 'black',
                width: 3
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

    var source = new VectorSource({
        features: (new GeoJSON()).readFeatures(createGeojsonObject(getTransformedPolygon(polygonLngLat)))
    });

    var outlinedLayer = new VectorLayer({
        source: source,
        style:   outlineStyles
    });

    return outlinedLayer;
}

function buildInvertedPolygon(polygonLngLat) {
    //Style for the inverted polygon
    var invertedStyles = [
        new Style({
            fill:   new Fill({
                color: 'rgba(0, 0, 0, 0.2)'
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

    var source = new VectorSource({
        features: (new GeoJSON()).readFeatures(createInvertedGeojsonObject(getTransformedPolygon(polygonLngLat)))
    });

    return new VectorLayer({
        source: source,
        style:   invertedStyles
    });
}



