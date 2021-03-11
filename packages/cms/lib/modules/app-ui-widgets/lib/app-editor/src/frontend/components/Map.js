import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { ShapeRecognition, HiddenImagesQuiz } from './games';

import WebViewLeaflet from "react-native-webview-leaflet"

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});


const Map = (props) => {
  return <WebViewLeaflet
      ref={component => (this.webViewLeaflet = component)}
      // The rest of your props, see the list below
    /> ;
}


export default Map;
