import React from "react";
import { ImageBackground } from "react-native";

const SafeBackgroundImage = (props) => {
  return (props.backgroundImage ?
      <ImageBackground source={{
        uri: props.backgroundImage
      }}> {props.children} </ImageBackground> :
        <> {props.children} </>
    )
}

export default SafeBackgroundImage;
