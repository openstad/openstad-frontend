import React, { useState } from "react";
import { Text, Button, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const FrontendButton = (props) => {
  return props.resource ? <ResourceButton {...props} /> : <StaticButton  {...props} />;
}

const ResourceButton = (props) => {
  return (
      <Text style={styles.buttonText}>
        {props.activeResource[props.keyButton]}
      </Text>
  );
}

const StaticButton = (props) => {
  return (
      <Text style={styles.buttonText}>
        {props.buttonText}
      </Text>
  );
};

export default FrontendButton;
