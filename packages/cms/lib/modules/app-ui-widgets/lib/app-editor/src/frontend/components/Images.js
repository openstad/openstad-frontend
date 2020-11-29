import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const Image = (props) => {
  return props.resource ? <ResourceImage {...props} /> : <StaticImage  {...props} />;
}

const ResourceImage = () => {
  return (
      <Image style={styles.titleText} src={props.activeResource[props.keyImage]} />
  );
}

const StaticImage = (props) => {
  return (
    <Image style={styles.titleText} src={props.image} />
  );
};

export default Image;
