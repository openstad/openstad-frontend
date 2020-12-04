import React, { useState } from "react";
import { Image } from "react-native";

const Logo = (props) => {
  const { height, width, src } = props;

  console.log('orporopr', props)

  return (
    <Image
      style={{ width: 300, height: 60 }}
      source={{
          uri: src,
        }}
    />
  );
}

export default Logo;
