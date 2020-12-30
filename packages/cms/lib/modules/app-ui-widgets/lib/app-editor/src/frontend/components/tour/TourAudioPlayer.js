import React, { Component, useLocation } from 'react';
import { View, Text } from 'react-native';
import AudioPlayer from '../AudioPlayer';


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

function TourAudioPlayer (props) {
  return (
    <div className="bottom-bar">
      <AudioPlayer
        autoPlay={true}
        audioFile={props.audioFile ? props.audioFile : null }
        testaudioFile={'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3'}
        previous={props.previous}
        next={props.next}
        info={props.info}
      />
    </div>
  )
}
export default TourAudioPlayer;
