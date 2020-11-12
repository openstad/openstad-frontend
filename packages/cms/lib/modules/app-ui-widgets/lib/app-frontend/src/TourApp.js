import React, { Component, useLocation } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import Fotorama from './Fotorama';
import LocateControl from "./LocateControl"

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

function TourAudioPlayer (props) {
  return (
    <div className="bottom-bar">
      <small>
        <b>{props.stepActiveIndex + 1}</b> of {props.stepTotal}
      </small>
      <h3>  {props.title}</h3>

      <a href="javascript:void(0);" onClick={() => {
        props.resetAudio();
      }} className="tour-detail-close">✕</a>


      <AudioPlayer
        showSkipControls={true}
        showJumpControls={false}
        onClickPrevious={props.previous}
        onClickPrevious={props.next}
        autoPlay={true}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        src={props.audioFile}
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
        <div>
          <a href="#" className="tour-detail-close">✕</a>
          <div className="tour-detail-view">
            <div className="tour-detail-view-inner">
              {props.step.images &&
              <Fotorama
                 imp
                 data-allowfullscreen="true"
                 data-width="100%"
                 data-arrows="always"
                 data-min-width="100%"
                 data-ratio="500/250"
                 data-maxheight="250"
                 data-fit="cover"
                 data-loop="true"
                 data-keyboard="true"
                 data-transition="slide"
              >
                {props.step.images.map((image) => {
                  return <img src={image} />
                })}
              </Fotorama>
              }
              <div className="tour-detail-view-inner-content">
                <div className="flex">
                  <a href="javascript:void(0);" onClick={() => {
                    props.previousStep();
                  }}>
                    ← Previous step
                  </a>
                  <a href="javascript:void(0);" onClick={() => {
                    props.nextStep();
                  }}>
                    Next step →
                  </a>
                </div>

                <br />

                <div>
                  {props.stepActiveIndex + 1} of {props.stepTotal}
                </div>

                <a href="javascript:void(0);" onClick={() => {
                  props.selectAudioStep(props.step.id);
                }}>
                  <img src="/play-circle.svg" /> <b> Play </b>
                </a>

                <h1>{props.step.title}</h1>
                <p>{props.step.description}</p>
              </div>
          </div>
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
    console.log('this.props.coordinates', this.props.steps)

    const locateOptions = {
        position: 'topright',
        strings: {
            title: 'Show me where I am, yo!'
        },
        onActivate: () => {} // callback before engine starts retrieving locations
      }

    return (
      <Map center={mapCenter} zoom={12} style={{ position: 'absolute', top: '48px', bottom: '0', width: '100%'}}>
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
          color={'black'}
        />
        }

      </Map>
    )
  }
}


class TourApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeViewStep: null,
      activeAudioStep: null,
      activeViewstepIndex: false,
      activeAudioStepIndex: false
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
    var activeViewStepId, activeViewStep;

    if (hash.startsWith('#step-detail')) {
      activeViewStepId = parseInt(hash.replace('#step-detail-', ''), 10);
    }


    if (activeViewStepId) {
      activeViewStep = this.props.steps.find((step) => {
        return step.id === activeViewStepId;
      })
    }

    var activeViewstepIndex = activeViewStep ?  this.props.steps.map(function(e) { return e.id; }).indexOf(activeViewStep.id) : false;
//
    this.setState({
      activeViewStep: activeViewStep,
      activeViewStepIndex: activeViewstepIndex
    }) ;
  }

  selectAudioStep (stepId) {

    var activeAudioStep = this.props.steps.find((step) => {
      return step.id ===stepId;
    });

    var activeAudioStepIndex = activeAudioStep ?  this.props.steps.map(function(e) { return e.id; }).indexOf(activeAudioStep.id) : false;


    this.setState({
      activeAudioStep: activeAudioStep,
      activeAudioStepIndex: activeAudioStepIndex
    });
  }

  resetAudio () {
    this.setState({
      activeAudioStep: null,
      activeAudioStepIndex: false
    });
  }

  render() {
    return (
      <div>
        <TitleBar
          title={this.props.title}
          />
        <TourMap
          steps={this.props.steps}
          coordinates={this.props.coordinates}
        />
        {this.state.activeAudioStep &&
          <TourAudioPlayer
           title={this.state.activeAudioStep.title}
           stepActiveIndex={this.state.activeAudioStepIndex}
           stepTotal={this.props.steps.length}
           audioFile={this.state.activeAudioStep.audio.file}
           resetAudio={this.resetAudio.bind(this)}
           isPreviousAvailable={true}
           isNextAvailable={true}
           previous={() => {
             if(this.props.steps[this.state.activeAudioStepIndex -1]) {
               this.selectAudioStep(this.props.steps[this.state.activeAudioStepIndex -1].id)
             }
           }}
           next={() => {
             if(this.props.steps[this.state.activeAudioStepIndex + 1]) {
               this.selectAudioStep(this.props.steps[this.state.activeAudioStepIndex +1].id)
             }
           }}
         />
        }
        <TourList />
        <TourDetailView
          step={this.state.activeViewStep}
          selectAudioStep={this.selectAudioStep.bind(this)}
          stepActiveIndex={this.state.activeViewStepIndex}
          stepTotal={this.props.steps.length}
          previousStep={() => {

          }}
          nextStep={() => {

          }}
        />
      </div>
    )
  }
}

export default TourApp;
