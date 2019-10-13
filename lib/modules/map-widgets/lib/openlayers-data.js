const getMarkerUrl = function(idea, themes) {
    if (idea.status == 'CLOSED' || idea.status == 'DENIED') {
        return '/img/idea/flag-gray.svg';
    } else {
        if (themes && themes.length > 0) {
            var selectedTheme = themes.filter(function (theme) {
                // todo: Can we match this in another way besides theme name?
                return theme.value == idea.extraData.theme;
            });

            if (selectedTheme && selectedTheme.length == 1 && selectedTheme[0].flag) {
                return'/img/idea/flag-' + selectedTheme[0].flag + '.svg';
            }
        }
    }

    return '/img/idea/flag-blue.svg';
}
// Todo: Map -> use same data for openlayers vs googlemaps
module.exports = {
    createMapConfig: (ideas, data) => {

        //Load polygon from global settings
        const polygonLngLat = data.global.mapPolygons ? data.global.mapPolygons : null;

        const markers = [];
        //Create a marker for every plan
        ideas.forEach((idea) => {
            if (idea.location && (idea.status != 'DENIED' || ideas.length == 1)){
                if (idea.location.coordinates[0] && idea.location.coordinates[1]) {
                    const themes = data.global.themes;
                    const markerUrl = getMarkerUrl(idea, themes);

                    markers.push({
                        lat: idea.location.coordinates[0],
                        lng: idea.location.coordinates[1],
                        name: 'marker',
                        category: idea.extraData.theme,
                        markerUrl: markerUrl
                    });
                }
            }
        });

        return {
            polygonLngLat,
            markers
        }
    }
};
