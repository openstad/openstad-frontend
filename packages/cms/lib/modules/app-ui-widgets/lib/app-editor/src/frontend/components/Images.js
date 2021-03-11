import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const FrontendImage = (props) => {
  return props.resource ? <ResourceImage {...props} /> : <StaticImage  {...props} />;
}

const ResourceImage = (props) => {
  return (
      <Image style={styles.titleText} src={props.activeResource[props.keyImage]} />
  );
}

const StaticImage = (props) => {
  const style = {
    height: props.height,
    width: props.width
  };

  if (props.circle) {
    style.borderRadius = props.height ? props.height / 2 : 50;
    style.overflow = 'hidden';
  }

  console.log('style', style)

  return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
          <Image source={{uri: props.src}} style={style}  resizeMode={"cover"} />
      </View>
  );
};

export default FrontendImage;
