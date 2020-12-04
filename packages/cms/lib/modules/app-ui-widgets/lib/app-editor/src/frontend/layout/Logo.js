import React, { useState } from "react";
import { Image } from "react-native";

const Logo = (props) => {
  const { height, width, image } = props;

  return (
    <Image
      style={{ width: width, height: height }}
      source={require(image)}
    />
  );
}
