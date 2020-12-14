import React, { Component, useLocation } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';

import 'react-h5-audio-player/lib/styles.css';
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

L.NumberedDivIcon = L.Icon.extend({
	options: {
    // EDIT THIS TO POINT TO THE FILE AT http://www.charliecroom.com/marker_hole.png (or your own marker)
    iconUrl: '/marker.png',
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

function TourList () {
  return (<div></div>)
}

function TourAudioPlayer () {
  return (
    <div className="bottom-bar">
      <AudioPlayer
        showSkipControls={true}
        showJumpControls={false}
        autoPlay={false}
        customProgressBarSection={
          [
            RHAP_UI.PROGRESS_BAR
          ]
        }
        customAdditionalControls={[]}
        customVolumeControls={[RHAP_UI.CURRENT_TIME,
                    <div>/</div>,
                    RHAP_UI.DURATION,]}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        onPlay={e => console.log("onPlay")}
        // other props here
      />
    </div>
  )
}

function TourDetailView (props) {
  return (
    <div>
      {props.step ?
      <div className="tour-detail-view">
        <div className="tour-detail-view-inner">
          <a href="#">X</a>
          {props.step.images && props.step.images[0] && <img src={props.step.images[0]} />}
          <h1>{props.step.title}</h1>
          <p>{props.step.description}</p>
        </div>
      </div>
      :
      <div />
      }
    </div>
  )
}

function TitleBar (props) {
  return (
    <div className="title-bar">
      <a href="#" className="title-bar-back-button">
        <img src="/arrow-left-circle.svg" />
      </a>
      <span className="title-bar-title">
        {props.title}
      </span>
    </div>
  )
}


class TourMap extends Component {
  render() {
    console.log('this.props.coordinates', this.props.coordinates)
    return (
      <Map center={mapCenter} zoom={12} style={{ position: 'absolute', top: '48px', bottom: '67px', width: '100%'}}>

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
            {/*  <Popup>
                {step.images && step.images[0] && <img src={step.images[0]} />}
                {step.title}.<br />
                {step.Description}
              </Popup>*/}
            </Marker>
          )
        })}

        {this.props.coordinates &&
        <Polyline
          positions={this.props.coordinates.map(function(step) {
            return [step[1], step[0]];
          })}
          color={'black'}
        />
        }
        {/*
        <Polyline
          positions={this.props.steps.map(function(step) {
            return step.position;
          })}
          color={'blue'}
        />
        */}
      </Map>
    )
  }
}


class TourApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStepId: null,
    };

  }

  componentDidMount() {
    window.addEventListener("hashchange", this.handleHashChange.bind(this), false);
    this.handleHashChange();
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange.bind(this), false);
  }

  handleHashChange() {
    var location =  window.location;
    var hash = location.hash;
    var activeStepId;

    if (hash.startsWith('#step-detail')) {
      activeStepId = parseInt(hash.replace('#step-detail-', ''), 10);
    }

    this.setState({
      activeStepId: activeStepId
    }) ;
  }

  render() {
    return (
      <div>
        <TitleBar title="Tour Demo" />
        <TourMap
          steps={this.props.steps}
          coordinates={this.props.coordinates}
        />
        <TourAudioPlayer />
        <TourList />
        <TourDetailView
          step={this.props.steps.find((step) => {
            return step.id === this.state.activeStepId;
          })}
        />
      </div>
    )
  }
}

export default TourApp;
