import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';

const styles = {
  positionBg: {
    left: 0,
    top: 0,
    width: '100%',
    position: 'absolute'
  },
  topMe: {
    position: 'relative',
    zIndex: 1000
  }
}

function TitleBar (props) {
  return (
    <div className="title-bar">
      <View pointerEvents="none" style={{...styles.positionBg}}>
        <Image source={{uri: '../../../images/oval@4x.png'}} w/>
      </View>

      <View pointerEvents="none" style={{...styles.gradientBg, ...styles.positionBg2}}></View>

      <div style={styles.topMe}>
        <a href="#" className="title-bar-back-button">
          <Image src="/arrow-left-circle.svg" />
          <Image source={require('../../../images/back@2x.png')} style={{height: 10, width: 14}}/>
        </a>
        <span className="title-bar-title">
          {props.title}
        </span>
      </div>
    </div>
  )
}

export default TitleBar;
