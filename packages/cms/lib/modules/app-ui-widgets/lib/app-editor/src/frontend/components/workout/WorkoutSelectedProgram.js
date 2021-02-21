import React, {Component} from "react";
import {View, Text, StyleSheet, ScrollView} from "react-native";

const styles = {
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    activeTab: {}
};

const workoutProgram = {
    periods: [
        {
            workouts: [{}],
        },
        {
            workouts: [{}],
        },
    ],
    periodType: 'Week' //days, weeks
};


class WorkoutSelectedProgram extends Component {
    constructor(props) {
        super(props);

        const startingIndex = 0;
        this.state = {
            activePeriodIndex: startingIndex,
            activePeriod: workoutProgram.periods[startingIndex]
        };
    }

    render() {
        return (
            <View>
                <Text style={styles.title}> {workoutProgram.title}</Text>
                <ScrollView horizontal style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    {workoutProgram.periods.map((period, i) => {
                        const styles = this.state.activePeriodIndex === i ? styles.activeTab : {};

                        return (
                            <TouchableOpacity key={"period" + i} onPress={() => {
                                this.setState({
                                    activePeriodIndex: i,
                                    activePeriod: workoutProgram.periods[i]
                                })
                            }}>
                                <Text style={styles}>{workoutProgram.periodType} i + 1</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <ScrollView>
                    {this.state.activePeriod &&
                    <Overview
                        resource="workout"
                        resourceData={this.state.activePeriod.workouts}
                    />
                    }
                </ScrollView>
            </View>
        )
    }
}

export default WorkoutSelectedProgram;
