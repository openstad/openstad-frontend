const getIconUrl = function(status) {
    // Todo: refactor this check
    if(status == 'DONE'  || status == 'ACCEPTED' || status == 'BUSY') {
        return '/img/idea/flag-blue.svg';
    } else if ( status == 'CLOSED'  || status == 'DENIED') {
        return '/img/idea/flag-gray.svg';
    } else {
        return '/img/idea/flag-red.svg';
    }
}
// Todo: Map -> use same data for openlayers vs googlemaps
module.exports = {
    createMapConfig: (ideas, data, styles, markerStyle) => {
        const markers = [];
        ideas.forEach((idea) => {
            markers.push({
                position: { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] },
                icon: {
                    url: getIconUrl(idea.status),
                    size: [22, 24],
                        anchor : [ 4, 21],
                },
                href: '/'+ data.global.ideaSlug + '/' + idea.id ,
                status: idea.status,
                endDate: idea.endDate,
            });
        });

        // delete old markers when there are too many
        var selectedMarkers = [];
        if (markers.length > 20) {
            markers.forEach(function(marker) {
                var select = true;
                if (marker.status ==  'CLOSED') {
                    var datediff = new Date().getTime() - new Date(marker.endDate).getTime();
                    if ( datediff > 1000 * 60 * 60 * 24 * 90 ) {
                        select = false;
                    }
                }
                selectedMarkers.push(marker);

                if (select) {
                    //	 selectedMarkers.push(marker);
                }
            });
        } else {
            selectedMarkers = markers
        }

        const openstadMapMarkerstyles = markerStyle;
        const openstadMapPolygon = data.global.mapPolygons ? data.global.mapPolygons : null;

        const openstadPolygons = openstadMapPolygon;
        const openstadMapDefaults = {
            center: {lat: data.global.mapCenterLat, lng: data.global.mapCenterLng},
            zoom: data.global.mapZoomLevel,
            zoomControl: true,
            minZoom: 12,
            maxZoom: 17,
            disableDefaultUI: true,
            styles: styles ? styles : null
        };

        return {
            markers,
            selectedMarkers,
            openstadMapMarkerstyles,
            openstadMapPolygon,
            openstadPolygons,
            openstadMapDefaults,
        }
    }
}
