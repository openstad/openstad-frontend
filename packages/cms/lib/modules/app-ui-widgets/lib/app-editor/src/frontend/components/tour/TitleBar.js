import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';

const styles = {
  gradientBg : {
    width: 320,
    height: 225,
    padding: 22,
    marginBottom:  53,
    filter: 'blur(26px)',
    backgroundColor: '#f7f7ff',
    position: 'absolute',
    top: -150
  },
  positionBg1: {
    left: -130,
  },
  positionBg2: {
    left: 130,
  },
  topMe: {
    position: 'relative',
    zIndex: 1000
  }
}

function TitleBar (props) {
  return (
    <div className="title-bar">
      <View pointerEvents="none" style={{...styles.gradientBg, ...styles.positionBg1}}></View>
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
