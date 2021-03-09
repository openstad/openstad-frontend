import React, { useState } from "react";
import { Text, Button, StyleSheet } from "react-native";


const displayBlock = {
  display: 'block'
}

const styles = {
  buttonText: {
    ...displayBlock,
    fontSize: 13,
    fontWeight: "bold",
    backgroundColor: '#000',
    color: '#FFF',
    padding: 10,
    width: '100%',
    textAlign: 'center',
    borderRadius: 5
  },
};

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
        {props.text}
      </Text>
  );
};

export default FrontendButton;
