function initMap( el, options ) {
	options || (options = {});
	var defaults = {
		center           : {lat: 52.3732175, lng: 4.8495996},
		zoom             : 13,
		disableDefaultUI : true,
		tilt: 0,
		styles: [{
			"featureType": "administrative",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#3f4043"
			}]
		}, {
			"featureType": "administrative.land_parcel",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "landscape.man_made",
			"stylers": [{
				"color": "#ffffff"
			}]
		}, {
			"featureType": "landscape.natural",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#f5f5f5"
			}]
		}, {
			"featureType": "poi.attraction",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#f0f0f0"
			}]
		}, {
			"featureType": "poi.attraction",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.business",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.medical",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#bed400"
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "geometry.stroke",
			"stylers": [{
				"color": "#bed400"
			}]
		}, {
			"featureType": "poi.place_of_worship",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.school",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.sports_complex",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#e0e0e0"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#e0e0e0"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "geometry.stroke",
			"stylers": [{
				"color": "#f0f0f0"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#666666"
			}]
		}, {
			"featureType": "transit.line",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#f2f2f2"
			}, {
				"weight": 1.5
			}]
		}, {
			"featureType": "transit.line",
			"elementType": "geometry.stroke",
			"stylers": [{
				"color": "#ffcc00"
			}, {
				"weight": 4.5
			}]
		}, {
			"featureType": "transit.station",
			"elementType": "labels.icon",
			"stylers": [{
				"saturation": -55
			}]
		}, {
			"featureType": "transit.station",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#3f4043"
			}]
		}, {
			"featureType": "water",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#009fe9"
			}]
		}, {
			"featureType": "water",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#4c4c4c"
			}]
		}]
	};
	for( var key in options ) {
		if( options[key] != undefined ) {
			defaults[key] = options[key];
		}
	}
	return new google.maps.Map(el, defaults);
}
function initMarker( options ) {
	options.crossOnDrag = options.crossOnDrag || false;
	options.icon        = options.icon || {
		size   : new google.maps.Size(40, 44),
		anchor : new google.maps.Point(8, 43)
	};
	options.icon.url = options.icon.url || '/modules/openstad-assets/img/flag.svg';
	return new google.maps.Marker(options);
}

function LocationEditor( input, map ) {
	this.input = input;
	var location = this.getLocation();

	//var div  = document.createElement('div');
	// input.parentNode.appendChild(div);

	this.map = initMap(map, {
		center      : location,
		zoom        : location ? 14 : 13,
		zoomControl : true
	});

	this.map.addListener('click', this.onMapClick.bind(this));

	if( location ) {
		this.setMarker(location);
	}
}

LocationEditor.prototype.onMapClick = function( event ) {
	this.setMarker(event.latLng);
	console.log('event', event);
	var latitude = event.latLng.lat();
  var longitude = event.latLng.lng();

	/*
 	console.log( latitude + ', ' + longitude );
	console.log('x: '+ x + ', y: ' + y );
	var x  = parseInt(event.xa.offsetX, 10) + 'px';
	var y  = parseInt(event.xa.offsetY, 10) + 'px';
	$('body').append('<div style="position:absolute;background:red; width:5px; height:5px; top:'+y+'; left:'+x+'" "></div>')
	*/

	this.storeLocation();
};
LocationEditor.prototype.onMarkerClick = function() {
	this.removeMarker();
	this.storeLocation();
};
LocationEditor.prototype.onMarkerDrag = function( event ) {
	this.storeLocation();
};

LocationEditor.prototype.getLocation = function() {
	var point = JSON.parse(this.input.value || null);
	if( point ) {
		return {lat: point.coordinates[0], lng: point.coordinates[1]}
	} else {
		return null;
	}
};
LocationEditor.prototype.storeLocation = function() {
	var value;
	if( this.marker ) {
		var latLng = this.marker.getPosition();
		console.log( latLng.lat() + ', ' + latLng.lng() );

		var point  = {type: 'Point', coordinates: [latLng.lat(), latLng.lng()]};
		value = JSON.stringify(point)
	} else {
		value = null;
	}
	this.input.value = value;
	$(this.input).trigger('change');
};

LocationEditor.prototype.setMarker = function( latLng ) {
	if( !this.marker ) {
		this.marker = this._createMarker(latLng);
	} else {
		this._moveMarker(latLng);
	}

	setTimeout(function() {
		console.log( latLng.lat() + ', ' + latLng.lng() );

		this.map.panTo(latLng);

	}.bind(this), 350);
};
LocationEditor.prototype.removeMarker = function() {
	this.marker.setMap(null);
	this.marker = null;
};

LocationEditor.prototype._createMarker = function( latLng ) {
	console.log('latLng', latLng);

	var marker = initMarker({
		position  : latLng,
		map       : this.map,
		draggable : true
	});


	marker.addListener('click', this.onMarkerClick.bind(this));
	marker.addListener('dragend', this.onMarkerDrag.bind(this));

	return marker;
};
LocationEditor.prototype._moveMarker = function( latLng ) {
	this.marker.setPosition(latLng);

};
