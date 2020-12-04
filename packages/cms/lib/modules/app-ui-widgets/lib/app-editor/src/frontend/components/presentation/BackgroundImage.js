import React, { useState } from "react";
import { Image} from "react-native";

let { StyleSheet } = React;

let styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  }
});

const BackgroundImage = (props) => {
  return <Image source={require(props.image)} style={styles.backgroundImage} />
}

export default BackgroundImage;
