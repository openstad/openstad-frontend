import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin"
  }
});

const RichText = (props) => {
  return props.resource ? <ResourceRichText {...props} /> : <StaticRichText  {...props} />;
}

const StaticRichText = (props) => {
  return (
      <Text style={styles.baseText}>
        {props.text}
      </Text>
  );
};

const ResourceRichText = (props) => {
  return (
      <Text style={styles.baseText}>
        {props.activeResource[props.keyContent]}
      </Text>
  );
};

export default RichText;
