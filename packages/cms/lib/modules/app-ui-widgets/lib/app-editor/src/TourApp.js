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
    return (
      <Map center={mapCenter} zoom={12} style={{ position: 'absolute', top: '48px', bottom: '67px', width: '100%'}}>
        <TileLayer
          url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=BqThJi6v35FQeB3orVDl"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {this.props.steps.map(function(step) {
          return (
            <Marker position={step.position} onClick={function () {
              var location =  window.location;
              location.hash = '#step-detail-' + step.id;
            }}>
            {/*  <Popup>
                {step.images && step.images[0] && <img src={step.images[0]} />}
                {step.title}.<br />
                {step.Description}
              </Popup>*/}
            </Marker>
          )
        })}
        <Polyline
          positions={this.props.steps.map(function(step) {
            return step.position;
          })}
          color={'blue'}
        />
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
