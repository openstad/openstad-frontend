import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ComponentManager from '../ComponentManager';

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin"
  }
});

const Columns = (props) => {
  const amouuntOfColumns = props.areas.length;
  const columnWidth = 100 / amouuntOfColumns;

  return (
      <View style={{
        width: `${columnWidth}%`
      }}>
        {props.areas.map((column, index) => (
          <View key={index}>
            <ComponentManager components={column.components} />
          </View>
        ))}
      </View>
  );
};

export default Columns;
