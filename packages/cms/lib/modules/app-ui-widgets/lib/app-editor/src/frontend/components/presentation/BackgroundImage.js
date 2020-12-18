import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  }
});

const BackgroundImage = (props) => {
  return <Image source={{uri : props.src}} style={styles.backgroundImage} />
}

export default BackgroundImage;
