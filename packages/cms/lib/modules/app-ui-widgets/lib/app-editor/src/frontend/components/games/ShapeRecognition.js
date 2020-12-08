import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { shapeRecognitionDefaults } from "./defaults";
import Quiz from './quiz/Quiz.js';

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const ShapeRecognition = (props) => {
  return <Quiz
    autoNext={5000}
    shuffle={true}
    questions={shapeRecognitionDefaults.questions}
  />
}

export default ShapeRecognition;
