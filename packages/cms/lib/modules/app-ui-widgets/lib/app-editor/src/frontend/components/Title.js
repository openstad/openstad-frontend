import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const defaultStyles = {
  marginTop: 10,
  fontSize: 22,
}

const Title = (props) => {
  const styles = {...defaultStyles, ...(props.styles || {})}

  return props.resource ? <ResourceTitle {...props} styles={styles} /> : <StaticTitle  {...props} styles={styles} />;
}

const ResourceTitle = (props) => {
  return (
      <Text style={props.styles}>
        {props.activeResource[props.keyTitle]}
      </Text>
  );
}

const StaticTitle = (props) => {
  return (
      <Text style={props.styles}>
        {props.title}
      </Text>
  );
};


export default Title;
