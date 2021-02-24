import React, {Component} from "react";
import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import Overview from "../Overview";

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
            workouts: [{
                id: 1,
                title: 12
            }],
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
        console.log('this.props.resourcesData', this.props.resourcesData)
        return (
            <View>
                <Text style={styles.title}> {workoutProgram.title}</Text>
                <ScrollView horizontal style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    {workoutProgram.periods.map((period, i) => {

                        return (
                            <TouchableOpacity key={"period" + i} onPress={() => {
                                this.setState({
                                    activePeriodIndex: i,
                                    activePeriod: workoutProgram.periods[i]
                                })
                            }}>
                                <Text style={this.state.activePeriodIndex === i ? styles.activeTab : {}}>
                                    {workoutProgram.periodType} {i + 1}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <ScrollView>
                    {this.state.activePeriod &&
                    <Overview
                        resource="workout"
                        resourceSchemas={this.props.resourceSchemas}
                        resourcesData={this.props.resourcesData}
                    />
                    }
                </ScrollView>
            </View>
        )
    }
}

export default WorkoutSelectedProgram;
