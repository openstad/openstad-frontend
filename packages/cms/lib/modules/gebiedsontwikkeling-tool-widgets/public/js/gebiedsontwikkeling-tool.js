// ----------------------------------------------------------------------------------------------------
// vars and definitions - todo: deze zouden ook configureerbaar moeten zijn

if (window.L) {


var site;
var map;

var currentMarker;
var currentIdea;
var currentInput = {};

var activeFilter = 0; // parseInt(getCookie('ideasActiveFilter')) || 0;

var mapIcon = L.divIcon({ html: '', className: 'icon', iconSize: [undefined, 22], iconAnchor: [20, 27] });
var mapIconWithArgs = L.divIcon({ html: '', className: 'icon with-args', iconSize: [undefined, 22], iconAnchor: [20, 27] });
var mapIconActive = L.divIcon({ html: '', className: 'icon active', iconSize: [undefined, 22], iconAnchor: [20, 27] });
var mapIconActiveWithArgs = L.divIcon({ html: '', className: 'icon active with-args', iconSize: [undefined, 22], iconAnchor: [20, 27] });

var filters = ['Te volle afvalcontainer', 'Defecte afvalcontainer', 'Afval in de omgeving van afvalcontainers', 'Afval op straat', 'Overig'];

// voor nu hardcoded - dit moet uit de site.config komen
var config = {
}

// end vars and definitions
// ----------------------------------------------------------------------------------------------------
// init

function initGebiedsontwikkelingTool () {

  if (!document.querySelector('#gebiedsontwikkeling-tool')) return;

  config = siteConfig || {};

	var mapconfig = Object.assign({
		// todo: dit zou deepmerge moeten woorden
		// todo: include de site config
		target: 'openstad-map',
		zoom: 14,
		onClickHandler: onClickMap,
		useClustering: true,
		autoZoomAndCenter: 'polygon',
    clustering: {
      showCoverageOnHover: false,
      maxClusterRadius: maxClusterRadius,
    }
	}, config.openstadMap || {});

	document.querySelector('#' + mapconfig.target).innerHTML = '';
	map = new OpenStadMap(mapconfig);

	showIdeasOnMap();

	resetInfoBlock();

}

window.addEventListener("load", initGebiedsontwikkelingTool);

// end init
// ----------------------------------------------------------------------------------------------------
// showIdeasOnMap

function showIdeasOnMap(startWithIdeaId) {

	var match = window.location.hash.match(/(#|&)ideaId=(\d+)(&|$)/)
	var startWithIdeaId = match && match[2];

	var match = window.location.hash.match(/(#|&)showArguments=(\d+)(&|$)/)
	var startWithArgumentsForId = match && match[2];

	var match = window.location.hash.match(/(#|&)showReactions=(\d+)(&|$)/)
	var startWithReactionsForArgumentId = match && match[2];

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

			var startWithMarker;

			ideas.forEach(function (idea) {
        if (!idea.location) return;
				var useIcon = mapIcon;
				if (idea.argumentsFor && idea.argumentsFor.length) {
					useIcon = mapIconWithArgs;
				}
				var marker = map.addMarker({ lat: idea.location.coordinates[0], lng: idea.location.coordinates[1], icon: useIcon, href: onClickMarker });
				marker.idea = idea;

				if (idea.id == startWithIdeaId) startWithMarker = marker;

			})

			if (!displayType == 'simple') {
				activateIdeasFilter(activeFilter)
			}

			if (startWithMarker) {
				onClickMarker(startWithMarker);
				if ( startWithArgumentsForId ) {
					showIdeaArguments(startWithArgumentsForId);
				}
				if (startWithReactionsForArgumentId) {
					showIdeaArgumentReactions(currentIdea, startWithReactionsForArgumentId);
				}
			}

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

	if (displayType == 'simple') {
		return;
	}

	if ( !map.config.polygon || !map.isPointInPolygon( args.latlng, map.config.polygon )) {
		return;
	}

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
	var infoblock = document.querySelector('#info-block');
	if (infoblock && infoblock.querySelector('#location')) {
		infoblock.querySelector('#location').value = JSON.stringify([args.latlng.lat, args.latlng.lng]);
	}


	map.getPointInfo(args.latlng, currentMarker, setAddress)

}

// end onClickMap
// ----------------------------------------------------------------------------------------------------
// onClickMarker

function onClickMarker(marker) {

	if (displayType == 'simple') {
		return;
	}

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
	return { before: 'In de buurt van ', address: address, city: city };
}

function setAddress(address, marker) {
	var infoblock = document.querySelector('#info-block');
	if (infoblock.querySelector('#location')) {
		infoblock.querySelector('#location').onchange();
		openStep(1, 0)
	}
	var html = typeof address == 'object' && address._display ?  parseAddressToHTML(address) : address;
	if (!html.address) {
		html.before = '';
		html.address = 'Voor deze locatie is geen adres beschikbaar'
		html.city = '';
	}
	if (infoblock.querySelector('#address-text')) {
		infoblock.querySelector('#before-address-text') && ( infoblock.querySelector('#before-address-text').innerHTML = html.before );
		infoblock.querySelector('#address-text').innerHTML = html.address;
		infoblock.querySelector('#city-text').innerHTML = html.city;
	}
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

function resetMap() {

	currentMarker = undefined;
	currentIdea = undefined;
	currentInput = {};

	resetInfoBlock();

	initGebiedsontwikkelingTool();
	onResetShowIdea = undefined;

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

function activateIdeasFilter(which) {
	if (!map) return;

	activeFilter = parseInt(which);
	document.cookie = 'ideasActiveFilter=' + activeFilter;

	document.getElementById('ideas-filter-select').value = activeFilter;

	map.setFilter(function(marker) {
		if (marker.isInput) return true;
		if (activeFilter) {
			return marker.idea && marker.idea.extraData && marker.idea.extraData.categorie && marker.idea.extraData.categorie == filters[activeFilter - 1];
		} else {
			return true;
		}
	})

}

function deactivateAll() {
	activateIdeasFilter(0)
}

// end filters
// ----------------------------------------------------------------------------------------------------
// showError

function showError(error) {
	// todo
	alert(error.message ? error.message : error);
}

}
// end showError
// ----------------------------------------------------------------------------------------------------
// TAF
