import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin"
  }
});

const RichText = (props) => {
  return (
      <Text style={styles.baseText}>
        {props.text}
      </Text>
  );
};

export default RichText;
