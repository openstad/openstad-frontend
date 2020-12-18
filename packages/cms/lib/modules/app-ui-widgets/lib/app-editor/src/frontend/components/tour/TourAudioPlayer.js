import React, { Component, useLocation } from 'react';
import { View, Text } from 'react-native';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';

import 'react-h5-audio-player/lib/styles.css';

function TourAudioPlayer (props) {
  return (
    <div className="bottom-bar">
      <small>
        <b>{props.stepActiveIndex + 1}</b> of {props.stepTotal}
      </small>
      <h3>  {props.title}</h3>

      {!props.audioFile &&
      <em> No audio available for this step </em>
      }

      <a href="javascript:void(0);" onClick={() => {
        props.resetAudio();
      }} className="tour-detail-close">✕</a>

      <AudioPlayer
        showSkipControls={true}
        showJumpControls={false}
        onClickPrevious={props.previous}
        onClickNext={props.next}
        autoPlay={true}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        src={props.audioFile? props.audioFile : null }
        onPlay={e => console.log("onPlay")}
        // other props here
      />
    </div>
  )
}
export default TourAudioPlayer;
