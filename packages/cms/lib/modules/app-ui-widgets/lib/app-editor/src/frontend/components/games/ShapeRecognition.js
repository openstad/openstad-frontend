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
    backgroundImage={shapeRecognitionDefaults.backgroundImage}
    autoNext={3000}
    shuffle={true}
    answerPosition={'top'}
    questionPosition={'bottom'}
    questions={shapeRecognitionDefaults.questions}
  />
}

export default ShapeRecognition;
