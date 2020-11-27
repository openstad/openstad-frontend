import React, { useState } from "react";
import { Text, StyleSheet } from "react-native-web";

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const Title = () => {
  return
}

const ResourceTitle = () => {

}

const StaticTitle = (props) => {
  return (
      <Text style={styles.titleText}>
        {props.title}
      </Text>
  );
};


export default Title;
