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
  progressBar: {
    height: 4,
    background: theme.primaryColor,
  },
  progressBarInner: {
    height: 4,
    background: theme.primaryColorLighter,
  },
  colContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  colThird: {
    width: '33.333%',
    paddingRight: 10
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
     <TouchableOpacity onPress={pause}>
       <Image source={require('../../images/play-orange@2x.png')} style={{height: 14, width: 14, ...style}}/>
     </TouchableOpacity>
   );
 }

const PauseButton = ({pause, style}) => {
  style = style ? style : {};

  return (
    <TouchableOpacity onPress={pause}>
      <Image source={require('../../images/pause-white@2x.png')} style={{height: 14, width: 14, ...style}}/>
    </TouchableOpacity>
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
           currentPosition: this.audio.seek()
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
          <View style={{...styles.progressBarInner, width: this.getProgressBarPercentage()}}></View>
        </View>
        <View style={styles.colContainer}>
          <View style={styles.colThird}>
            {this.state.play ? <PauseButton pause={this.pause}></PauseButton> : <PlayButton play={this.play}>Play</PlayButton>}
          </View>
          <View style={styles.colThird}>
            <Text>{this.state.currentPosition + '/' + this.state.duration}</Text>
          </View>
          <View style={styles.colThird}>
            <View> {this.props.info} </View>
          </View>
        </View>
       </View>
      );
   }
}

export default AudioPlayer;
