import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import LocateControl from "./LocateControl"
import theme from '../theme';

import "leaflet/dist/leaflet.css";

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
    iconUrl: '/images/marker.png',
    number: '',
    shadowUrl: null,
//    iconSize: new L.Point(25, 41),
	//	iconAnchor: new L.Point(13, 41),
		//popupAnchor: new L.Point(0, -33),
    iconSize:     [38, 38],
    shadowSize:    [38, 38],
    iconAnchor:   [10, 26],
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
		div.appendChild ( img );
		div.appendChild ( numdiv );
		this._setIconStyles(div, 'icon');
		return div;
	},

	//you could change this to add a shadow like in the normal marker if you really wanted
	createShadow: function () {
		return null;
	}
});

const mapCenter = [52.370216, 4.895168];

class TourMap extends Component {

  render() {
    console.log('this.props.coordinates', this.props.steps)

    const locateOptions = {
        position: 'bottomLeft',
        strings: {
            title: 'Show me where I am, yo!'
        },
        onActivate: () => {} // callback before engine starts retrieving locations
      }

    return (
      <Map center={mapCenter} zoom={12} style={{ position: 'absolute', top: '0', bottom: '0', width: '100%'}}>
        <LocateControl options={locateOptions} startDirectly />

        <TileLayer
          url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=BqThJi6v35FQeB3orVDl"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {this.props.steps.map(function(step, i) {
          return (
            <Marker
              position={step.position}
              onClick={function () {
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
