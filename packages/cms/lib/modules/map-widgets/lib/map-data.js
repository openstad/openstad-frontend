'use sctrict';

const getIconUrl = function(status, theme, themes) {
    // Todo: refactor this check
    const flagUrl = getFlagUrlByTheme(theme, themes);

    if (flagUrl) {
      return flagUrl;
    }

    const flag = getFlagByTheme(theme, themes);
    if (flag) {
      return getMarkerUrlBasedOnTheme(status, flag);
    }

    if(status == 'DONE'  || status == 'ACCEPTED' || status == 'BUSY') {
        return '/modules/openstad-assets/img/idea/flag-blue.png';
    } else if ( status == 'CLOSED'  || status == 'DENIED') {
        return '/modules/openstad-assets/img/idea/flag-gray.png';
    } else {
        return '/modules/openstad-assets/img/idea/flag-red.png';
    }
}

const getFlagUrlByTheme = function (currentTheme, themes) {
  var flagUrl = false;

  if (themes && themes.length > 0) {
      var selectedTheme = themes.filter(function (theme) {
          // todo: Can we match this in another way besides theme name?
          return theme.value == currentTheme;
      });

      if (selectedTheme && selectedTheme.length == 1) {
        flagUrl = selectedTheme[0].mapUploadedFlagUrl ? selectedTheme[0].mapUploadedFlagUrl : false;
      }
  }

  return flagUrl;
}

const getIconSize = function (currentTheme, themes) {
  var sizeArray = [22, 24];

  if (themes && themes.length > 0) {
      var selectedTheme = themes.filter(function (theme) {
          // todo: Can we match this in another way besides theme name?
          return theme.value == currentTheme;
      });
      if (selectedTheme && selectedTheme.length == 1) {
        sizeArray[0] = selectedTheme[0].mapFlagWidth ? parseInt(selectedTheme[0].mapFlagWidth, 10) : sizeArray[0];
        sizeArray[1] = selectedTheme[0].mapFlagHeight ?parseInt(selectedTheme[0].mapFlagHeight, 10) : sizeArray[1];
      }
  }

   return sizeArray;
}

const getFlagByTheme = function(currentTheme, themes) {
    if (themes && themes.length > 0) {
        var selectedTheme = themes.filter(function (theme) {
            // todo: Can we match this in another way besides theme name?
            return theme.value == currentTheme;
        });
        if (selectedTheme && selectedTheme.length == 1) {
            return selectedTheme[0].flag;
        }
    }

    return null;
}
const getMarkerUrlBasedOnTheme = function(idea, flag) {
    if (idea.status == 'CLOSED' || idea.status == 'DENIED') {
        return '/modules/openstad-assets/img/idea/flag-gray.svg';
    }

    return'/modules/openstad-assets/img/idea/flag-' + flag + '.png';
}

function getHref(ideaSlug, id) {
  return ideaSlug && ideaSlug.match(/\{ideaId\}/i)?  `/${ideaSlug.replace(/\{ideaId\}/ig, id)}` : `/${ideaSlug}/${id}`;
}

// Todo: refactor this method
function deleteOldMarkers(markers) {
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
        });
    } else {
        selectedMarkers = markers
    }

    return selectedMarkers;
}

function Marker(coordinates, status, url, endDate, theme, themes) {
    this.position = { lat: coordinates[0], lng: coordinates[1] };
    this.icon = {
        url: getIconUrl(status, theme, themes),
        size: getIconSize(theme, themes),
        anchor: [4, 21],
    };
    this.href = url;
    this.status = status;
    this.endDate = endDate;
    this.name = 'marker';
    this.category = theme;
}

module.exports = class MapConfigBuilder {
    constructor(globalData) {
        this.globalData = globalData;
        this.config = {
            defaultSettings: null,
            markers: null,
            polygon: null,
            markerStyles: null,
            editorMarker: null,
            editorMarkerElement: null
        };
    }

    getConfig() {
        return this.config;
    }

  setDefaultSettings(settings) {
    
        this.config.defaultSettings = {
            center: (settings.mapCenterLat && settings.mapCenterLng) ? {lat: settings.mapCenterLat, lng: settings.mapCenterLng} : null,
            zoom: settings.mapZoomLevel || 13,
            zoomControl: settings.zoomControl || true,
            minZoom: settings.minZoom || 10,
            maxZoom: settings.maxZoom || 16,
            useMarkerLinks: settings && settings.useMarkerLinks === false || settings.useMarkerLinks == 'false' ? false : true,
            disableDefaultUI: settings.disableDefaultUI || true,
            styles: settings.styles || null,
            googleMapsApiKey: settings.googleMapsApiKey || '',
            autoCenter: settings.autoCenter === false || settings.autoCenter == 'false' ? false : true,
        };

        return this;
    }
    setPolygon(polygon) {
        this.config.polygon = polygon;
        return this;
    }
    setMarker() {
        return this;
    }
    
    setMarkersByResources(resources) {
        const markers = [];
        resources ? resources.forEach((idea) => {

          if (idea.location && idea.location.coordinates) {
              //should move ideaslug away from globaldata
              let ideaSlug = this.globalData.siteUrl + getHref(this.globalData.ideaSlug, idea.id);
              markers.push(
                new Marker(idea.location.coordinates, idea.status, ideaSlug, idea.endDate, idea.extraData.theme, this.globalData.themes)
              );
          }
        }) : [];

        this.config.markers = deleteOldMarkers(markers);

        return this;
    }
    setEditorMarker() {
        this.config.editorMarker = {
            icon     : {
                url    : '/modules/openstad-assets/img/idea/flag-red.png',
                size   : [22, 24],
                anchor : [ 4, 21],
            }
        }
        return this;
    }
    setEditorMarkerElement(name) {
        this.config.editorMarkerElement = name;

        return this;
    }
    setMarkerStyle(styles) {
        this.config.markerStyles = styles;

        return this;
    }
}
