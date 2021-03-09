import React, {Component} from "react";
import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import {Overview, RichText, Title, Card} from "../index";

const tabStyles = {
    fontSize: 13,
    textTransform: 'uppercase',
    marginRight: 10,
}

const styles = {
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },

    activeTab: {
        ...tabStyles,
        textDecorationLine: 'underline',
    }
};

const workoutProgram = {
    title: "Strength training",
    description: "This program lasts for 4 weeks with 3 sessions per week with low reps high weight. Take at least one rest day between every session\n",
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

        return (
            <View>
                <Title
                    title={workoutProgram.title}
                    style={{marginTop: 5}}
                />
                <RichText text={workoutProgram.description} />

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
                                <Text style={this.state.activePeriodIndex === i ? styles.activeTab : tabStyles}>
                                    {workoutProgram.periodType} {i + 1}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <ScrollView>
                    <Card>
                        0 of 3 sessions done
                        this {workoutProgram.periodType}
                    </Card>
                    {this.state.activePeriod &&
                    <Overview
                        resource="workout"
                        resourceSchemas={this.props.resourceSchemas}
                        resourcesData={this.props.resourcesData}
                        titleKey={'title'}
                        displayType={'card'}
                        backgroundImageKey={'images'}
                    />
                    }
                </ScrollView>
            </View>
        )
    }
}

export default WorkoutSelectedProgram;
