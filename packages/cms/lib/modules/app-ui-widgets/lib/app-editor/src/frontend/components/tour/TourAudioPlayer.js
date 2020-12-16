import React, { Component, useLocation } from 'react';
import { View, Text } from 'react-native';


function TourAudioPlayer () {
  return (
    <div className="bottom-bar">
      <AudioPlayer
        showSkipControls={true}
        showJumpControls={false}
        autoPlay={false}
        customProgressBarSection={[RHAP_UI.PROGRESS_BAR]}
        customAdditionalControls={[]}
        customVolumeControls={[RHAP_UI.CURRENT_TIME, <div>/</div>,  RHAP_UI.DURATION,]}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        onPlay={e => console.log("onPlay")}
        // other props here
      />
    </div>
  )
}

export default TourAudioPlayer;
