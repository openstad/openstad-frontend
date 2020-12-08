import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { ShapeRecognition, HiddenImagesQuiz } from './games';

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const displayTypes = {
  'ShapeRecognition' : ShapeRecognition,
  'HiddenImagesQuiz' : HiddenImagesQuiz
}

const Game = (props) => {
  const GameComponent = displayTypes[props.activeResource.game];
  return <GameComponent />;
}


export default Game;
