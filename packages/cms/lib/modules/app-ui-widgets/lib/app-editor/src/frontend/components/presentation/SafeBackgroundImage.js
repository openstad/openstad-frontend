import React from "react";
import { ImageBackground,View } from "react-native";

const SafeBackgroundImage = (props) => {
  return (props.backgroundImage ?
      <ImageBackground style={props.style} source={{
        uri: props.backgroundImage
      }}> {props.children} </ImageBackground> :
        <View style={props.style}> {props.children} </View>
    )
}

export default SafeBackgroundImage;
