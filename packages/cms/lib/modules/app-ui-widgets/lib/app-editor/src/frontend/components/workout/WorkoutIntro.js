import React  from "react";
import { View, Text, StyleSheet } from "react-native";
import VideoWorkout from './VideoWorkout';

const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
        fontWeight: "bold"
    }
});

const WorkoutIntro = (props) => {
    console.log('const WorkoutIntro = (props) =>', props)
    return <View>
        <Text>This is intro </Text>
        <VideoWorkout />
    </View>
}

export default WorkoutIntro;
