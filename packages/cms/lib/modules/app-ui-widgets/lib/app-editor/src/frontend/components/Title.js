import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";

const styles = {
  titleTextContainer: {

  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  }
};

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
      <Text style={styles.titleText}>
        {props.activeResource[props.keyTitle]}
      </Text>
  );
}

const StaticTitle = (props) => {
  return (
      <View>
        <Text style={styles.titleText}>
          {props.title}
        </Text>
      </View>
  );
};


export default Title;
