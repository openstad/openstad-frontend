import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AudioPlayer from '../AudioPlayer';
import TrackPlayer from 'react-native-track-player';

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
 class AudioPlayer extends React.Component {
     constructor(props) {
     super(props);
     this.state = {
       play: false,
       pause: true,
     }
     this.url = "http://streaming.tdiradio.com:8000/house.mp3";
     this.audio = new Audio(this.url);
   }

   play = () => {
   this.setState({ play: true, pause: false })
     this.audio.play();
   }

   pause = () => {
   this.setState({ play: false, pause: true })
     this.audio.pause();
   }

   render() {

   return (
     <div>
       <button onClick={this.play}>Play</button>
       <button onClick={this.pause}>Pause</button>
     </div>
     );
   }
 }


function AudioPlayer (props) {
  return (
    <View>
      <Text> AudioPlayer </Text>
    </View>
  )
}
export default AudioPlayer;
