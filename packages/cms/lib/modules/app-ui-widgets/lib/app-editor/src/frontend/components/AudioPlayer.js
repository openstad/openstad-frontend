import React, { Component } from 'react';
/**
 * For the native app we need to find a way to move a
 */
//import TrackPlayer from 'react-native-track-player';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';

// web audio api
import {Howl, Howler} from 'howler';

import theme from './theme';

const styles = {
  audioPlayer: {

  },
  timer : {
    fontSize: 10,
    fontWeight: 500,
    color: '#979797',
    height: 28,
    lineHeight: 28,
  },
  timerWidth : {

  },
  audioPlayerInner: {
    padding: 18
  },
  progressBar: {
    height: 4,
    background:  theme.primaryColorLighter,
  },
  progressBarInner: {
    height: 4,
    background: theme.primaryColor,
  },
  colContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  controlContainer : {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  justifContent : {
    justifyContent: 'space-evenly'
  },
  heightCutoff: {
    height: 28,
    overflow: 'hidden',
    textAlignVertical: 'center',
  },
  colThird: {
    width: '33.333%',
    paddingRight: 10
  },
  colFourth: {
    width: '25%',
    paddingRight: 10
  },
  colThirty: {
    width: '30%',
    paddingRight: 10
  },
  colForty: {
    width: '40%',
    paddingRight: 10
  },
}

const stringFrontPadding = (string,pad,length) => {
  return (new Array(length+1).join(pad)+string).slice(-length);
}

const formatSecondsToMinutes = (seconds) => {
  seconds = seconds ? seconds : 0;
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds - (minutes * 60);

  console.log('minutes', minutes);
  console.log('secondsLeftsecondsLeft', secondsLeft);

  return minutes.toFixed().toString().padStart(2, '0') +':'+ secondsLeft.toFixed().padStart(2, '0');
}

/*
<a href="javascript:void(0);" onClick={() => {
  props.resetAudio();
}} className="tour-detail-close">✕</a>
<small>
  <b>{props.stepActiveIndex + 1}</b> of {props.stepTotal}
</small>
<h3>  {props.title}</h3>

{!props.audioFile &&
<em> No audio available for this step </em>
}
 */

const PlayButton = ({play, style}) => {
   style = style ? style : {};

   return (
     <TouchableOpacity onPress={play}>
       <Image source={require('../../images/play-orange@2x.png')} style={{height: 28, width: 28, ...style}}/>
     </TouchableOpacity>
   );
 }

const PauseButton = ({pause, style}) => {
  style = style ? style : {};

  return (
    <TouchableOpacity onPress={pause}>
      <Image source={require('../../images/pause-orange@2x.png')} style={{height: 28, width: 28, ...style}}/>
    </TouchableOpacity>
  );
}

const PrevousButton = ({previous, style}) => {
  style = style ? style : {};

  return (
    <TouchableOpacity onPress={previous}>
      <Image source={require('../../images/prev@2x.png')} style={{height: 13, width: 16, ...style}}/>
    </TouchableOpacity>
  );
}


const NextButton = ({next, style}) => {
  style = style ? style : {};

  return (
    <TouchableOpacity onPress={next}>
      <Image source={require('../../images/next@2x.png')} style={{height: 13, width: 16, ...style}}/>
    </TouchableOpacity>
  );
}


class AudioPlayer extends React.Component {
  constructor(props) {
     super(props);

     this.state = {
       play: props.audioFile ? true: false,
       audioFile: props.audioFile,
       duration: 0,
       currentPosition: 0
     }

     this.setAudioFile(props.audioFile);
     this.runIntervalCheckingAudioProgress();
   }

   runIntervalCheckingAudioProgress () {
     this.audioProgressInterval = setInterval(() => {
      // console.log('this.audio in interval', this.audio.duration());

       if (this.audio && this.audio.seek) {

         this.setState({
           currentPosition: this.audio.seek(),
           duration: this.audio.duration()
         });

       }
     }, 300)

   }

   componentWillUnmount () {
     if (this.audioProgressInterval) {
       clearInterval(this.audioProgressInterval)
     }
   }

   setAudioFile(audioFile) {
     this.audio = new Howl({
       src: audioFile
     });

     this.audio.play();

     this.setState({
       duration: this.audio.duration(),
       play: true
     })
   }

   play() {
     this.setState({ play: true })
     this.audio.play();
   }

   pause() {
     this.setState({ play: false })
     this.audio.pause();
   }

   getProgressBarPercentage () {
     // in case
     if (!this.state.duration || this.state.duration === 0) {
       return 0;
     }

     return ((this.state.currentPosition / this.state.duration) * 100 ).toFixed(2) + '%';
   }

   render() {
     return (
       <View style={styles.audioPlayer}>
        <View style={styles.progressBar}>
          <View style={{...styles.progressBarInner, width: this.getProgressBarPercentage()}}></View>
        </View>
        <View style={styles.audioPlayerInner}>
          <View style={styles.colContainer}>
            <View style={styles.colThirty}>
              <View style={{...styles.controlContainer}}>
                <PrevousButton previous={this.props.previoua} />
                {this.state.play ? <PauseButton pause={this.pause.bind(this)} /> : <PlayButton play={this.play.bind(this)} />}
                <NextButton  next={this.props.next}  />
              </View>
            </View>
            <View style={styles.colThirty}>
              <View style={styles.controlContainer}>
                <Text style={{...styles.timer, width: 31}}>{formatSecondsToMinutes(this.state.currentPosition)}</Text>
                <Text style={styles.timer}>/</Text>
                <Text style={{...styles.timer, width: 31}}>{formatSecondsToMinutes(this.state.duration)}</Text>
              </View>
            </View>
            <View style={{...styles.colForty, ...styles.heightCutoff}}>
               {this.props.info}
            </View>
          </View>
        </View>
       </View>
      );
   }
}

/*
<View> {this.props.info} </View>

 */

export default AudioPlayer;
