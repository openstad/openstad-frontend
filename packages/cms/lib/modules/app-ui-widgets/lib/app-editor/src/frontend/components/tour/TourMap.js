import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline, useLeaflet } from 'react-leaflet';
import L from 'leaflet';
import LocateControl from "./LocateControl"
import theme from '../theme';
import "leaflet/dist/leaflet.css";
import MapboxGlLayer from "../maps/MapboxGlLayer";

/*
var gl = L.mapboxGL({
  attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
  style: 'https://api.maptiler.com/maps/7a1e9afb-36c0-48fd-830c-7ac80a07d90b/style.json?key=BqThJi6v35FQeB3orVDl'
})*/

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

L.NumberedDivIcon = L.Icon.extend({
	options: {
    // EDIT THIS TO POINT TO THE FILE AT http://www.charliecroom.com/marker_hole.png (or your own marker)
    iconUrl: require('../../../images/marker@2x.png'),
    shadowUrl: require('../../../images/marker-shadow@2x.png'),
    number: '',
  //  shadowUrl: null,
//    iconSize: new L.Point(25, 41),
	//	iconAnchor: new L.Point(13, 41),
		//popupAnchor: new L.Point(0, -33),
    iconSize:     [22, 22],
    shadowSize:    [22, 22],
    iconAnchor:   [22, 22],
    shadowAnchor: [4, 62],
    popupAnchor:  [-3, -76],
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		*/
		className: 'leaflet-div-icon'
	},

	createIcon: function () {
		var div = document.createElement('div');
		var img = this._createImg(this.options['iconUrl']);
    img.setAttribute ( "class", "icon-img" );
		var numdiv = document.createElement('div');
		numdiv.setAttribute ( "class", "number" );
		numdiv.innerHTML = this.options['number'] || '';

  //  var shadowImg = this._createImg(this.options['shadowUrl']);
  //  shadowImg.setAttribute ( "class", "icon-img" );

		div.appendChild ( img );
  //  div.appendChild ( shadowImg );
		div.appendChild ( numdiv );
		this._setIconStyles(div, 'icon');
		return div;
	},

	//you could change this to add a shadow like in the normal marker if you really wanted
/*	createShadow: function () {
		return null;

	}*/
});


const mapCenter = [52.370216, 4.895168];

class TourMap extends Component {

  panToPosition (position) {
    const map = this.map.leafletElement;
    console.log('map', map)
    //const { map } = useLeaflet();



    if (!map) {
      return;
    }

    const zoom = 15;

    //this.map.getZoom() - 2

    map.setView(position, zoom, {
      animate: true
    })
  }


  componentDidMount() {
    const firstStep = this.props.steps[0];

    if (firstStep && firstStep.position) {
      this.panToPosition(firstStep.position)
    }
  }

  render() {
    const locateOptions = {
        position: 'bottomLeft',
        strings: {
            title: 'Show me where I am, yo!'
        },
        onActivate: () => {} // callback before engine starts retrieving locations
    };


    //this.panToPosition(firstPosition);

    return (
      <Map
        center={mapCenter}
        zoom={12}
        style={{position: 'absolute', top: '0', bottom: '0', width: '100%', ...this.props.style}}
        ref={(ref) => { this.map = ref; }}
      >
        <LocateControl options={locateOptions} startDirectly />
        <MapboxGlLayer
           accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
           //style="https://api.maptiler.com/maps/0275a5aa-0727-4a78-939c-8489ff711229/style.json?key=g5rCENm6IyC656bHa8wU"
           style="https://api.maptiler.com/maps/7a1e9afb-36c0-48fd-830c-7ac80a07d90b/style.json?key=BqThJi6v35FQeB3orVDl"
           attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        {this.props.steps.map(function(step, i) {
          return (
            <Marker
              position={step.position}
              onClick={(e) => {
                  var location =  window.location;
                  location.hash = '#step-detail-' + step.id;
              }}
              icon={new L.NumberedDivIcon({number: i + 1})}
            >

            </Marker>
          )
        })}
        {this.props.coordinates &&
        <Polyline
          positions={this.props.coordinates.map(function(step) {
            return [step[1], step[0]];
          })}
          color={theme.primaryColor}
        />
        }
      </Map>
    )
  }
}

export default TourMap;