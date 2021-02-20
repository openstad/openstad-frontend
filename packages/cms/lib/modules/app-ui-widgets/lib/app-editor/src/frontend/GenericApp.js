/* Layout elements */
import React, {Component} from 'react';
import {StaticScreen, ResourceScreen, LoginScreen, SplashScreen, SignInScreen, SignUpScreen} from './screens';
import {Logo} from './layout';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Platform, StyleSheet} from "react-native";
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import ScreenStackNavigator from './ScreenStackNavigator';

//import Ionicons from 'react-native-web-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
    fullHeight: {
        height: Platform.OS === 'web' ? '100vh' : '100%'
    }
})

const theme = {
    bodyBackgroundColor: '#000000',
    headerBackgroundColor: '#000000',
}

/*
screen = {
  type: resource|static|login,
  resourceType:
  id:
}
*/

const ScreenComponents = {
    'static': StaticScreen,
    'resource': ResourceScreen,
    'login': LoginScreen,
    'splash': SplashScreen
}

class GenericApp extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {
        const startScreenId = this.props.screens.startScreenId;


        if (!startScreenId) {
            return (
                <View>
                    <Text> Start screen not selected </Text>
                </View>
            );
        }

        return (
            <View style={{
                height: Platform.OS === 'web' ? '100%' : '100%',
                flex: 1
                //  ...this.props.styling.body.styles
            }}>
                <NavigationContainer
                >
                    <Tab.Navigator
                        screenOptionsTest={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                                let iconName;

                                if (route.name === 'Home') {
                                    iconName = focused
                                        ? 'ios-information-circle'
                                        : 'ios-information-circle-outline';
                                } else if (route.name === 'Settings') {
                                    iconName = focused ? 'ios-list-box' : 'ios-list';
                                }

                                // You can return any component that you like here!
                                return <Text>J</Text>;
                            },
                        })}
                    >
                        {this.props.screens.items.filter((screen) => {
                            return screen.inTabNavigation;
                        }).map((screen, i) => {

                            /*{props =>
                                ScreenStackNavigator
                            }*/
                            return (
                                <Tab.Screen
                                    name={screen.name}
                                    key={'tab' + i}
                                >
                                    {(props) =>
                                        <ScreenStackNavigator
                                            {...props}
                                            {...this.props}
                                            screen={screen}
                                        />
                                    }
                                </Tab.Screen>
                            )
                        })}
                    </Tab.Navigator>
                </NavigationContainer>
            </View>
        )
    }
}


export default GenericApp;
