import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const ShapeRecognition = (props) => {
  return <Quiz
    autoNext={5000}
    questions={hiddenImagesQuizDefaults.questions}
    backgroundImage
  />;
}

export default ShapeRecognition;
