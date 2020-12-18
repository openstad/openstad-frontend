import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { shapeRecognitionDefaults } from "./defaults";
import Quiz from './quiz/Quiz';

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const ShapeRecognition = (props) => {
  return <Quiz
    backgroundImage={shapeRecognitionDefaults.backgroundImage}
    autoNext={5000}
    shuffle={true}
    answerPosition={'top'}
    questionPosition={'bottom'}
    questions={shapeRecognitionDefaults.questions}
    displayAnswerTime={true}
  />
}

export default ShapeRecognition;
