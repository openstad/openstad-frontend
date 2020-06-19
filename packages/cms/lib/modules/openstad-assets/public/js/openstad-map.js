// ----------------------------------------------------------------------------------------------------
// OpenStadMap
// TODO: more text
// ----------------------------------------------------------------------------------------------------

function OpenStadMap( markerStyle, polygonStyle, editorInputElement, editorMarker ) {

	self = this;
	self.markerStyle = markerStyle || {};
	self.polygonStyle = polygonStyle || {};

	self.defaultConfig = {
		center           : {lat: 52.3732175, lng: 4.8495996},
		zoom             : 14,
		zoomControl      : true,
		disableDefaultUI : true,
	};
	// is editor
	if (editorInputElement) {

		self.onMapClick = function( event ) {
			self.setMarker(event.latLng);
			self.storeLocation();
		};

		self.onMarkerClick = function() {
			self.removeMarker();
			self.storeLocation();
		};

		self.onMarkerDrag = function( event ) {
			self.storeLocation();
		};

		// TODO: why self translation? Maybe Sequelize fieldtype?
		self.getLocation = function() {
			var point = JSON.parse(self.editorInputElement.value || null);
			if( point ) {
				return {lat: point.coordinates[0], lng: point.coordinates[1]}
			} else {
				return null;
			}
		};

		// TODO: why self translation? Maybe Sequelize fieldtype?
		self.storeLocation = function() {
			var value;
			if( self.editorMarker && self.editorMarker.getMap() ) {
				var latLng = self.editorMarker.getPosition();
				var point  = {type: 'Point', coordinates: [latLng.lat(), latLng.lng()]};
				value = JSON.stringify(point)
			} else {
				value = null;
			}
			self.editorInputElement.value = value;
			$(self.editorInputElement).trigger('change');
		};

		self.setMarker = function( latLng ) {
			if( !self.editorMarker.getMap() ) {
				self.editorMarker.setMap(self.map);
			}
			self._moveMarker(latLng);
			setTimeout(function() {
				self.map.panTo(latLng);
			}.bind(self), 350);
		};

		self.removeMarker = function() {
			self.editorMarker.setMap(null);
		};

		self._moveMarker = function( latLng ) {
			self.editorMarker.setPosition(latLng);
		};

		self.editorInputElement = editorInputElement;
		self.editorMarker = editorMarker;
		self.editorMarker.position = self.getLocation();

	}

}

OpenStadMap.prototype.createMap = function( config, markers, polygon, autoZoomAndCenter ) {

	if (typeof autoZoomAndCenter === 'undefined') {
		autoZoomAndCenter = true
	}

	self = this;

	// merge config
	config = Object.assign(self.defaultConfig, config)

	// init map
	self.map = new google.maps.Map(document.getElementById('map'), config);

	// add polygon
	if (polygon) {
		self.createCutoutPolygon( polygon );
	}

	// add markers
	if (markers) {
		self.createMarkers( markers );
	}

	// editor?
	if (self.editorInputElement) {
		if (self.editorMarker) {
			self.editorMarker = self.createMarker( self.editorMarker )
			self.editorMarker.addListener('click', self.onMarkerClick.bind(self));
			self.editorMarker.addListener('dragend', self.onMarkerDrag.bind(self));
		}

		console.log('bind self.map ', self.map);
		self.map.addListener('click', self.onMapClick.bind(self));
	}

	// set bounds and center
	if (autoZoomAndCenter) {
		var centerOn = markers && markers.length ? markers : polygon;
		if (self.editorMarker) {
			if (self.editorMarker.position) {
				centerOn = [self.editorMarker];
			} else {
				centerOn = polygon;
			}
		}
		if (centerOn) {
			self.setBoundsAndCenter( centerOn ); // prefer markers
		}
	}

}

OpenStadMap.prototype.createCutoutPolygon = function( polygon ) {

	// polygon must defined from the south west corner to work with the outer box
	var bounds = new google.maps.LatLngBounds();
	for (i = 0; i < polygon.length; i++) {
		bounds.extend(polygon[i]);
	}
	var center = bounds.getCenter();

	var smallest = 0; var index = 0;

	polygon.forEach(function( point, i ) {
		var y = Math.sin(point.lng-center.lng()) * Math.cos(point.lat);
		var x = Math.cos(center.lat())*Math.sin(point.lat) - Math.sin(center.lat())*Math.cos(point.lat)*Math.cos(point.lng-center.lng());
		var bearing = Math.atan2(y, x) * 180 / Math.PI;
		if (45 - bearing < smallest) {
			smallest = 45 - bearing;
			index = i;
		}
	});

	let a = polygon.slice(0, index - 1);
	let b = polygon.slice(index, polygon.length - 1);
	polygon = b.concat(a);

	// outer box
	// TODO: should be calculated dynamically from the center point
	var delta1 = 0.01;
	var delta2 = 5;
	var outerBox = [
		{lat: -90 + delta2, lng:  -180 + delta1 },
		{lat: -90 + delta2, lng:     0          },
		{lat: -90 + delta2, lng:   180 - delta1 },
		{lat:   0,          lng:   180 - delta1 },
		{lat:  90 - delta2, lng:   180 - delta1 },
		{lat:  90 - delta2, lng:     0          },
		{lat:  90 - delta2, lng:  -180 + delta1 },
		{lat:  90 - delta2, lng:  -180 + delta1 },
		{lat:   0,          lng:  -180 + delta1 },
	];

	// polygon style
	this.map.data.setStyle( Object.assign({}, self.polygonStyle ));

	this.map.data.add({
		geometry: new google.maps.Data.Polygon( [outerBox, polygon] )
	})

}

OpenStadMap.prototype.createMarkers = function( markers ) {

	self = this;

	markers.forEach(function(marker) {
		self.createMarker( marker )
	})

}

OpenStadMap.prototype.createMarker = function( marker ) {

	if (marker.icon && marker.icon.size) {
		marker.icon.size = new google.maps.Size(marker.icon.size[0], marker.icon.size[1]);
	}
	if (marker.icon && marker.icon.anchor) {
		marker.icon.anchor = new google.maps.Point(marker.icon.anchor[0], marker.icon.anchor[1]);
	}
	if (marker.href) {
		marker.icon.clickable = true;
	}

	marker.icon.url = marker.icon.url.replace(/\.svg/, '.png'); // IE can't handle svg icons

	var options = {
		position    : marker.position && marker.position.coordinates ? { lat: marker.position.coordinates[0], lng: marker.position.coordinates[1] } : marker.position,
		map         : self.map,
		icon        : marker.icon,
		crossOnDrag : self.markerStyle.crossOnDrag || false,
	}

	var googleMarker = new google.maps.Marker(options);
	if (marker.href) {
		googleMarker.addListener('click', function() {
			window.location.href = marker.href;
		});
	}

	return googleMarker;

}

OpenStadMap.prototype.setBoundsAndCenter = function( points ) {

	self = this;
	points = points || [];

	if (self.map.minZoom) {
		google.maps.event.addListenerOnce(self.map, 'bounds_changed', function() {
			if( self.map.getZoom() > self.map.maxZoom - 1 ) {
				self.map.setZoom( self.map.maxZoom - 1 );
			}
			if( self.map.getZoom() < self.map.minZoom + 1 ) {
				self.map.setZoom( self.map.minZoom + 1 );
			}
		});
	}

	var bounds = new google.maps.LatLngBounds();

	points.forEach(function(point) {
		if (!point.position && !(point.lat)) return;
		if (point.position) {
			point = point.position.coordinates ? { lat: point.position.coordinates[0], lng: point.position.coordinates[1] }  : point.position;
		}
		bounds.extend(point);
	})
	self.map.fitBounds(bounds);

}

// polyfill Object.assign
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
