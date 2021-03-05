import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  baseText: {
    marginTop: 5,
    marginBottom: 10,
    fontFamily: "Nunito_400Regular"
  }
});

const RichText = (props) => {
  return props.resource ? <ResourceRichText {...props} /> : <StaticRichText  {...props} />;
}

const StaticRichText = (props) => {
  return (
      <>
        {props.text.split("\n").map((text) => {
            return (
                <View>
                    <Text style={styles.baseText}>
                        {text.trim()}
                    </Text>
                </View>
            )
        })}
      </>
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
