import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AudioPlayer from '../AudioPlayer';
/**
 * For the native app we need to find a way to move a
 */
import TrackPlayer from 'react-native-track-player';

// web audio api
import {Howl, Howler} from 'howler';

const styles = {
  progressBar: {
    posi
  },
  progressBarInner: {

  },

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

const PlayButton = ({pause, style}) => {
   style = style ? style : {};

   return (
     <TouchableHighlight onPress={pause}>
       <Image sourse={require('../../images/play-orange@2x.png')} style={{height: 14, width: 14, ...style}}/>
     </TouchableHighlight>
   );
 }

const PauseButton = ({pause, style}) => {
  style = style ? style : {};

  return (
    <TouchableHighlight onPress={pause}>
      <Image sourse={require('../../images/pause-white@2x.png')} style={{height: 14, width: 14, ...style}}/>
    </TouchableHighlight>
  );
}

class AudioPlayer extends React.Component {
  constructor(props) {
     super(props);

     this.state = {
       play: false,
       audioFile: props.audioFile,
       duration: 0,
       currentPosition: 0
     }

     this.setAudioFile(props.audioFile);

     this.runIntervalCheckingAudioProgress()
   }

   runIntervalCheckingAudioProgress () {
     this.audioProgressInterval = setInterval(() => {
       if (this.audio && this.audio.seek) {
         this.setState({
           currentPosition: this.audio.seek();
         })
       }
     })

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
     if (this.state.duration === 0) {
       return 0;
     }

     return ((this.state.currentPosition / this.state.duration) * 100 ).toFixed(2) + '%';
   }

   render() {
     return (
       <View>
        <View style={styles.progressBar}>
          <View style={styles.progressBarInner, width: this.getProgressBarPercentage()}></View>
        </View>
        <View>
          {this.state.play ? <PauseButton pause={this.pause}></PauseButton> : <PlayButton play={this.play}>Play</PlayButton>}
          <Text>{this.state.currentPosition + '/' + this.state.duration}</Text>
          <View> {this.props.trackInfo} </View>
        </View>
       </View>
      );
   }
}

export default AudioPlayer;
