import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { hiddenImagesQuizDefaults } from "./defaults";
import Quiz from './quiz/Quiz.js';

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const HiddenImagesQuiz = (props) => {
  return (
    <Quiz
      autoNext={5000}
      shuffle={true}
      questions={hiddenImagesQuizDefaults.questions}
      displayAnswerTime
    />
  );
}

export default HiddenImagesQuiz;
