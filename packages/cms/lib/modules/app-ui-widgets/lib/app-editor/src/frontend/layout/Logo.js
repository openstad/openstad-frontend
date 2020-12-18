import React, { useState } from "react";
import { Image } from "react-native";

const Logo = (props) => {
  const { height, width, src } = props;

  return (
    <Image
      style={{ width: width, height: height }}
      source={{
          uri: src,
        }}
    />
  );
}

export default Logo;
