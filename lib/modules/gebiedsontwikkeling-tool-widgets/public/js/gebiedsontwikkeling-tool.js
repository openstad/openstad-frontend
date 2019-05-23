// ----------------------------------------------------------------------------------------------------
// vars and definitions - todo: deze zouden ook configureerbaar moeten zijn

var site;
var map;

var currentMarker;
var currentIdea;
var currentInput = {};

var activeFilter = parseInt(getCookie('ideasActiveFilter')) || 0;

var mapIcon = L.divIcon({ html: '', className: 'icon', iconSize: [undefined, 22], iconAnchor: [20, 27] });
var mapIconActive = L.divIcon({ html: '', className: 'icon active', iconSize: [undefined, 22], iconAnchor: [20, 27] });

var filters = ['Afvalcontainers', 'Grofvuil', 'Straat'];

// voor nu hardcoded - dit moet uit de site.config komen
var config = {
	ideas: {
		descriptionMinLength: 30,
		descriptionMaxLength: 200,
	},
	arguments: {
		descriptionMinLength: 30,
		descriptionMaxLength: 100,
	},
	openstadMap: {
		polygon: [{ "lng": 4.8753796, "lat": 52.373407 }, { "lng": 4.8755899, "lat": 52.374302499999999 }, { "lng": 4.8799131, "lat": 52.3813052 }, { "lng": 4.8796339, "lat": 52.381912800000002 }, { "lng": 4.880478, "lat": 52.3822531 }, { "lng": 4.8818058, "lat": 52.384352800000002 }, { "lng": 4.882637, "lat": 52.385410700000001 }, { "lng": 4.8846503, "lat": 52.388346599999998 }, { "lng": 4.8857963, "lat": 52.388147600000003 }, { "lng": 4.8911796, "lat": 52.388450200000001 }, { "lng": 4.8937804, "lat": 52.388671199999997 }, { "lng": 4.8956658, "lat": 52.3888313 }, { "lng": 4.8971002, "lat": 52.383473299999999 }, { "lng": 4.8987657, "lat": 52.382542000000001 }, { "lng": 4.9017615, "lat": 52.380958100000001 }, { "lng": 4.9058091, "lat": 52.379866399999997 }, { "lng": 4.9109777, "lat": 52.379982699999999 }, { "lng": 4.9117844, "lat": 52.376762900000003 }, { "lng": 4.9130404, "lat": 52.376807800000002 }, { "lng": 4.9142964, "lat": 52.376637100000003 }, { "lng": 4.9235616, "lat": 52.375160299999997 }, { "lng": 4.930471, "lat": 52.373219499999998 }, { "lng": 4.9324817, "lat": 52.371757100000004 }, { "lng": 4.9330223, "lat": 52.369993000000001 }, { "lng": 4.9328247, "lat": 52.3687465 }, { "lng": 4.9318203, "lat": 52.366566800000001 }, { "lng": 4.9271491, "lat": 52.366449799999998 }, { "lng": 4.9223217, "lat": 52.363750199999998 }, { "lng": 4.9198812, "lat": 52.363239800000002 }, { "lng": 4.9183577, "lat": 52.362234299999997 }, { "lng": 4.9117783, "lat": 52.361245799999999 }, { "lng": 4.9102065, "lat": 52.360537399999998 }, { "lng": 4.9082953, "lat": 52.3605771 }, { "lng": 4.9066727, "lat": 52.359713499999998 }, { "lng": 4.9046567, "lat": 52.359200899999998 }, { "lng": 4.8987439, "lat": 52.357973999999999 }, { "lng": 4.8908705, "lat": 52.358319899999998 }, { "lng": 4.8891062, "lat": 52.358981 }, { "lng": 4.8873652, "lat": 52.3602226 }, { "lng": 4.8841505, "lat": 52.361811799999998 }, { "lng": 4.8819952, "lat": 52.362042700000003 }, { "lng": 4.8813956, "lat": 52.363081800000003 }, { "lng": 4.8808146, "lat": 52.363490400000003 }, { "lng": 4.8793708, "lat": 52.3643261 }, { "lng": 4.8792691, "lat": 52.364957400000002 }, { "lng": 4.8787082, "lat": 52.365820599999999 }, { "lng": 4.8775395, "lat": 52.366781500000002 }, { "lng": 4.8767523, "lat": 52.368511699999999 }, { "lng": 4.8754901, "lat": 52.369786699999999 }, { "lng": 4.8745065, "lat": 52.3718772 }, { "lng": 4.8745782, "lat": 52.3725454 }, { "lng": 4.8753796, "lat": 52.373407 }],

	},
}

// end vars and definitions
// ----------------------------------------------------------------------------------------------------
// init

function initGebiedsontwikkelingTool () {

	// fetch site
	$.ajax({
		url: apiUrl + '/api/site/' + siteId,
		dataType: "json",
		crossDomain: true,
		beforeSend: function(request) {
			request.setRequestHeader("Accept", "application/json");
		},
		success: function(site) {

			var mapconfig = Object.assign({
				// todo: dit zou deepmerge moeten woorden
				// todo: include de site config
				target: 'openstad-map',
				zoom: 16,
				onClickHandler: onClickMap,
				useClustering: true,
				autoZoomAndCenter: true,
			}, config.openstadMap || {});

			map = new OpenStadMap(mapconfig);

			showIdeasOnMap();
			resetInfoBlock();
			
		},
		error: function(error) {
			showError(error);
		}
	});
	
}

window.addEventListener("load", initGebiedsontwikkelingTool);

// end init
// ----------------------------------------------------------------------------------------------------
// showIdeasOnMap

function showIdeasOnMap() {

	$.ajax({
		url: apiUrl + '/api/site/' + siteId + '/idea?includeUser=1&includeArguments=1',
		dataType: "json",
		crossDomain: true,
		beforeSend: function(request) {
			request.setRequestHeader("Accept", "application/json");
		},
		success: function(ideas) {

			ideas.forEach( idea => {
				var marker = map.addMarker({ lat: idea.location.coordinates[0], lng: idea.location.coordinates[1], icon: mapIcon, href: onClickMarker });
				marker.idea = idea;
			})

			map.setBoundsAndCenter( map.markers ); // prefer markers

			// debug
			// onClickMap({ latlng: { lat: 52.3710476, lng: 4.9005494 } })
			onClickMarker(map.markers[0])

			activateFilter(activeFilter)

		},
		error: function(error) {
			showError(error);
		}
	});

}

// end showIdeasOnMap
// ----------------------------------------------------------------------------------------------------
// onClickMap

function onClickMap(args) {

	if (currentMarker) {
		markerMakeInactive(currentMarker)
	}

	if (currentInput.marker) {

		map.updateMarker({ marker: currentInput.marker, lat: args.latlng.lat, lng: args.latlng.lng });
		showNewIdeaForm();
		markerMakeActive(currentInput.marker)

	} else {

		currentInput.marker = map.addMarker({ lat: args.latlng.lat, lng: args.latlng.lng, href: onClickMarker, icon: mapIconActive, doNotCluster: true });
		currentInput.marker.isInput = true;

		showNewIdeaForm();

	}

	currentMarker = currentInput.marker

	map.getPointInfo(args.latlng, currentMarker, setAddress)

}

// end onClickMap
// ----------------------------------------------------------------------------------------------------
// onClickMarker

function onClickMarker(marker) {

	if (currentMarker) {
		markerMakeInactive(currentMarker)
	}

	markerMakeActive(marker)

	if (marker.isInput) {
		showNewIdeaForm();
	} else {
		currentIdea = marker.idea;
		showIdeaDetails();
	}

	currentMarker = marker;

	if ( !( currentMarker.idea && currentMarker.idea.address ) ) {
		map.getPointInfo(marker._latlng, currentMarker, setAddress)
	}

}

// end onClickMarker
// ----------------------------------------------------------------------------------------------------
// infoblock

function parseAddressToHTML(json) {
	var address, city;
	if ( json && json.adres ) {
		address = json.adres;
		city = json.postcode + ' ' + json.woonplaats._display;
	} else {
		address = json.lat + ', ' + json.lng;
		city = ''
	}
	return { address, city };
}

function setAddress(address, marker) {
	var infoblock = document.querySelector('#info-block');
	if (infoblock.querySelector('#location')) {
		infoblock.querySelector('#location').value = ( address.lat && address.lng && JSON.stringify([ address.lat, address.lng ]) ) || null;
		infoblock.querySelector('#location').onchange();
		openStep(1)
	}
	var html = typeof address == 'object' && address._display ?  parseAddressToHTML(address) : address;
	infoblock.querySelector('#address-text').innerHTML = html.address;
	infoblock.querySelector('#city-text').innerHTML = html.city;
	if (marker && marker.idea) marker.idea.address = html;
}

function markerMakeActive(marker) {
	// todo: dit moet naar OpenStadMap.updateMarker
	marker.setIcon(mapIconActive)
}

function markerMakeInactive(marker) {
	marker.setIcon(mapIcon)
}

function toggleInfoBlock() {
	var infoBlockIsOpen = document.querySelector('#info-block').className.match(/(?:^| )open(?: |$)/);
	if (infoBlockIsOpen) {
		closeInfoBlock();
	} else {
		openInfoBlock();
	}
}

function openInfoBlock() {
	if ( !document.querySelector('#info-block').className.match(/(?:^| )open(?: |$)/) ) {
		document.querySelector('#info-block').className += ' open';
	}
}

function closeInfoBlock() {
	document.querySelector('#info-block').className = document.querySelector('#info-block').className.replace(/ ?open(?: |$)/g, '');
}


function resetInfoBlock() {
	document.querySelector('#info-block').innerHTML = document.querySelector('#default-info-block').innerHTML;
	closeInfoBlock();
	if (currentMarker) {
		markerMakeInactive(currentMarker)
	}
}

function showError(error) {
	alert(error);
}

// end infoblock
// ----------------------------------------------------------------------------------------------------
// filters

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

function activateFilter(which) {

	if (!map) return;

	document.getElementById('filter-selector-button-' + activeFilter).className = document.getElementById('filter-selector-button-' + activeFilter).className.replace(/ ?active/, '');

	activeFilter = which;
	document.cookie = 'ideasActiveFilter=' + activeFilter;

	map.setFilter(function(marker) {
		if (marker.isInput) return true;
		if (activeFilter) {
			return marker.idea && marker.idea.extraData && marker.idea.extraData.categorie && marker.idea.extraData.categorie == filters[activeFilter - 1];
		} else {
			return true;
		}
	})

	document.getElementById('filter-selector-button-' + activeFilter).className += ' active';
	
}

function deactivateAll() {
	activateFilter(0)
}

// end filters
// ----------------------------------------------------------------------------------------------------
// showError

function showError(error) {
	// todo
	console.log(error);
	alert(error);
}

// end showError
// ----------------------------------------------------------------------------------------------------
// TAF
