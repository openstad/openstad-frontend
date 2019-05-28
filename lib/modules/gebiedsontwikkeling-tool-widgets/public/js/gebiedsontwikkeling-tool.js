// ----------------------------------------------------------------------------------------------------
// vars and definitions - todo: deze zouden ook configureerbaar moeten zijn

if (window.L) {


var site;
var map;

var currentMarker;
var currentIdea;
var currentInput = {};

var activeFilter = parseInt(getCookie('ideasActiveFilter')) || 0;

var mapIcon = L.divIcon({ html: '', className: 'icon', iconSize: [undefined, 22], iconAnchor: [20, 27] });
var mapIconWithArgs = L.divIcon({ html: '', className: 'icon with-args', iconSize: [undefined, 22], iconAnchor: [20, 27] });
var mapIconActive = L.divIcon({ html: '', className: 'icon active', iconSize: [undefined, 22], iconAnchor: [20, 27] });
var mapIconActiveWithArgs = L.divIcon({ html: '', className: 'icon active with-args', iconSize: [undefined, 22], iconAnchor: [20, 27] });

var filters = ['Afvalcontainers', 'Grofvuil', 'Straat'];

// voor nu hardcoded - dit moet uit de site.config komen
var config = {
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

			config = {
				ideas: {
					descriptionMinLength: ( site.config && site.config.ideas && site.config.ideas.descriptionMinLength ) || 30,
					descriptionMaxLength: ( site.config && site.config.ideas && site.config.ideas.descriptionMaxLength ) || 200,
				},
				arguments: {
					descriptionMinLength: ( site.config && site.config.arguments && site.config.arguments.descriptionMinLength ) || 30,
					descriptionMaxLength: ( site.config && site.config.arguments && site.config.arguments.descriptionMaxLength ) || 100,
				},
				openstadMap: {
					polygon: ( site.config && site.config.openstadMap && site.config.openstadMap.polygon ) || undefined,
				},
			}

			var mapconfig = Object.assign({
				// todo: dit zou deepmerge moeten woorden
				// todo: include de site config
				target: 'openstad-map',
				zoom: 14,
				onClickHandler: onClickMap,
				useClustering: true,
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
		url: apiUrl + '/api/site/' + siteId + '/idea?includeUser=1&includeArguments=1?includeUserVote=1',
		dataType: "json",
		crossDomain: true,
		beforeSend: function(request) {
			request.setRequestHeader("Accept", "application/json");
			if (userJWT) {
				request.setRequestHeader('X-Authorization', 'Bearer ' + userJWT);
			}
		},
		success: function(ideas) {

			ideas.forEach(function (idea) {
				var useIcon = mapIcon;
				if (idea.argumentsFor && idea.argumentsFor.length) {
					useIcon = mapIconWithArgs;
				}
				var marker = map.addMarker({ lat: idea.location.coordinates[0], lng: idea.location.coordinates[1], icon: useIcon, href: onClickMarker });
				marker.idea = idea;
			})

			map.setBoundsAndCenter( map.markers ); // prefer markers

			// debug
			// onClickMap({ latlng: { lat: 52.3710476, lng: 4.9005494 } })
			// onClickMarker(map.markers[0])

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
	return { address: address, city: city };
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
	// todo: dit moet via een nieuwe functie OpenStadMap.updateMarker
	var useIcon = mapIconActive;
	if (marker.idea && marker.idea.argumentsFor && marker.idea.argumentsFor.length) {
		useIcon = mapIconActiveWithArgs;
	}
	marker.setIcon(useIcon)
}

function markerMakeInactive(marker) {
	var useIcon = mapIcon;
	if (marker.idea && marker.idea.argumentsFor && marker.idea.argumentsFor.length) {
		useIcon = mapIconWithArgs;
	}
	marker.setIcon(useIcon)
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
	document.cookie = 'ideasFilter=' + activeFilter;

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

}
// end showError
// ----------------------------------------------------------------------------------------------------
// TAF
