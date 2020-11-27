import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const Title = (props) => {
  return props.resource ? <ResourceTitle {...props} /> : <StaticTitle  {...props} />;
}

const ResourceTitle = () => {
  return (
      <Text style={styles.titleText}>
        {props.activeResource[props.keyTitle]}
      </Text>
  );
}

const StaticTitle = (props) => {
  return (
      <Text style={styles.titleText}>
        {props.title}
      </Text>
  );
};


export default Title;
