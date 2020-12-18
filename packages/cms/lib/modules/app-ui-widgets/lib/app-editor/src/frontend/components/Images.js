import React, { useState } from "react";
import { Text, StyleSheet, Image } from "react-native";

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
  return (
    <Image style={styles.titleText} src={props.image} />
  );
};

export default FrontendImage;
