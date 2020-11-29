import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const Button = (props) => {
  return props.resource ? <ResourceButton {...props} /> : <StaticButton  {...props} />;
}

const ResourceButton = () => {
  return (
      <Text style={styles.buttonText}>
        {props.activeResource[props.keyButton]}
      </Text>
  );
}

const StaticButton = (props) => {
  return (
      <Text style={styles.buttonText}>
        {props.button}
      </Text>
  );
};


export default Button;
