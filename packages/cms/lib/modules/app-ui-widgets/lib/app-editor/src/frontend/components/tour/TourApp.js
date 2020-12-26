import React, { Component, useLocation } from 'react';

import "./tour.css";

import TourDetailView from './TourDetailView';
import TourAudioPlayer from './TourAudioPlayer';
import TourTimelineView from './TourTimelineView';
import TourMap from './TourMap';
import TitleBar from './TitleBar';

import SwipeUpView from '../SwipeUpView';
import Gallery from '../Gallery/Gallery';

import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import styles from './styles';


// Research native / web
//import TrackPlayer from 'react-native-track-player';
//TrackPlayer.registerPlaybackService(() => require('./trackService.js'));


class TourApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStepId: null,
      activeAudioStep: true
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
        <TitleBar title={this.props.app.title} />
        <TourMap
          steps={this.props.steps}
          coordinates={this.props.coordinates}
        />

        /*
        <SwipeUpView
      	itemMini={<div />} // Pass props component when collapsed
      	itemFull={<div />} // Pass props component when show full
      	onShowMini={() => console.log('mini')}
      	onShowFull={() => console.log('full')}
      	onMoveDown={() => console.log('down')}
      	onMoveUp={() => console.log('up')}
      	disablePressToShow={false} // Press item mini to show full
      	style={{ backgroundColor: 'green' }} // style for swipe
      />
      */
        {this.state.gallery &&
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100000000
          }}>
            <TouchableOpacity onPress={() => {
              this.setState({
                gallery: false
              })
            }} style={{...styles.close, color:'white'}}>✕</TouchableOpacity>

            <Gallery
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}
              images={this.state.gallery.images}
              initialPage={this.state.gallery.initialImage}
            />
        </View>
        }
        {this.state.activeViewStep &&
        <TourTimelineView
          activeStep={this.state.activeViewStep}
          tour={this.props.app}
          playAudio={this.selectAudioStep.bind(this)}
          steps={this.props.steps}

          openGallery={(images, initialImage) => {
            this.setState({
              gallery: {
                images: images,
                initialImage: initialImage
              }
            })
          }}
          stepActiveIndex={this.state.activeViewStepIndex}
          backToMap={() => {
            window.location.hash = '#';
          }}
          stepTotal={this.props.steps.length}
          isPreviousAvailable={(() => {
            const previousStep = this.props.steps[this.state.activeViewStepIndex - 1];
            return previousStep;
          })()}
          isNextAvailable={(() => {
            return this.props.steps[this.state.activeViewStepIndex + 1];
          })()}
          previousStep={() => {
            const previousStep = this.props.steps[this.state.activeViewStepIndex - 1];

            if (previousStep) {
              window.location.hash = '#step-detail-' + previousStep.id;
            }
          }}
          nextStep={() => {
            const nextStep = this.props.steps[this.state.activeViewStepIndex + 1];

            if (nextStep) {
              window.location.hash = '#step-detail-' + nextStep.id;
            }
          }}
        />
        }
        {this.state.activeAudioStep &&
          <TourAudioPlayer
           title={this.state.activeAudioStep.title}
           stepActiveIndex={this.state.activeAudioStepIndex}
           stepTotal={this.props.steps.length}
           audioFile={this.state.activeAudioStep && this.state.activeAudioStep.audio ? this.state.activeAudioStep.audio.file : false}
           resetAudio={this.resetAudio.bind(this)}
           info={<>
             <Text style={{...styles.h2, ...styles.noPreWrap}}>
               <Text style={{...styles.small, color: '#333d48', paddingRight: 7, paddingTop: 4, paddingBottom: 5}}>
                  Location {this.state.activeAudioStepIndex + 1}
               </Text>
               This is it
              {this.state.activeAudioStep.title}
             </Text>
           </>}
           isPreviousAvailable={(() => {
             return !!this.props.steps[this.state.activeAudioStepIndex - 1];
           })()}
           isNextAvailable={(() => {
             return !!this.props.steps[this.state.activeAudioStepIndex + 1];
           })()}
           previous={() => {
             const previousStep = this.props.steps[this.state.activeAudioStepIndex - 1];

             if (previousStep) {
               this.selectAudioStep(previousStep.id)
             }
           }}
           next={() => {
             const nextStep = this.props.steps[this.state.activeAudioStepIndex + 1];

             if(nextStep) {
               this.selectAudioStep(nextStep.id)
             }
           }}
         />
        }

      </div>
    )
  }
}

export default TourApp;
