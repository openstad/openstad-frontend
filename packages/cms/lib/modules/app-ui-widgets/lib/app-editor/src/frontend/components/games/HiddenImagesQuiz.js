import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { hiddenImagesQuizDefaults } from "defaults";

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
      questions={hiddenImagesQuizDefaults.questions}
    />
  );
}

export default HiddenImagesQuiz;
