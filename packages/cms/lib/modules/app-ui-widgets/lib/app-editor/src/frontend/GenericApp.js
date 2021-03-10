/* Layout elements */
import React, {Component} from 'react';
import {StaticScreen, ResourceScreen, LoginScreen, SplashScreen, SignInScreen, SignUpScreen} from './screens';
import {Logo} from './layout';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Platform, StyleSheet} from "react-native";
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import ScreenStackNavigator from './ScreenStackNavigator';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
//import { useFonts, Nunito_400Regular } from '@expo-google-fonts/nunito';
//import * as Font from 'expo-font';

// import fonts
//import './fonts.js'

const Stack = createStackNavigator();

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

        this.state = {
            fontsLoaded: true
        };

    }

    async _loadFontsAsync() {
       /* await Font.loadAsync({
            Nunito_400Regular,
        });*/

        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    render() {
        const startScreenId = this.props.screens.startScreenId;

        if (!this.state.fontsLoaded) {
            return (
                <View>
                    <Text> Loading... </Text>
                </View>
            );
        }

        if (!startScreenId) {
            return (
                <View>
                    <Text> Start screen not selected </Text>
                </View>
            );
        }

        return (
            <View key={this.props.crudCount} style={{
                height: '100%',
                flex: 1, //  ...this.props.styling.body.styles
            }}>
                <NavigationContainer
                >
                    <Stack.Navigator
                        navigationOptions={{
                            //headerTitle: props => <Logo {...this.props.styling.header.logo} />,
                            //headerTitleAlign: 'center',
                            //headerStyle: this.props.styling.header,
                            //headerTintColor: '#fff',
                            //headerTitleStyle: {
                            //   fontWeight: 'bold',
                            //},
                        }}
                        hideForAllAcreenOptions={{
                            headerShown: false
                        }}
                    >
                        <Stack.Screen name={'Tabs'} options={{headerShown: false}}>
                            {props =>
                                <Tab.Navigator
                                    screenOptionsTest={({route}) => ({
                                        tabBarIcon: ({focused, color, size}) => {
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
                                    tabBarOptions={{
                                        activeTintColor: "#50d3a7",
                                        inactiveTintColor: "gray",
                                        showIcon: true,
                                        adaptive: false,
                                        labelStyle: {
                                            fontSize: 10,
                                        },
                                    }}
                                >
                                    {this.props.screens.items.filter((screen) => {
                                        return screen.inTabNavigation;
                                    }).map((screen, i) => {
                                        const ScreenComponent = ScreenComponents[screen.type];
                                        const resourceName = screen.type === 'resource' ? screen.name : false;
                                        const iconName = screen.icon ? screen.icon : 'home';
                                        /*{props =>
                                            ScreenStackNavigator
                                        }*/
                                        return (
                                            <Tab.Screen
                                                name={screen.name}
                                                key={'tab' + i}
                                                options={{
                                                    tabBarIcon: ({ color, size }) => (
                                                        <Icon name={iconName} color={color} size={14} style={{marginTop: 10}} />
                                                    ),
                                                }}
                                            >
                                                {(props) =>
                                                    <ScreenComponent
                                                        {...props}
                                                        resourcesData={this.props.resourcesData}
                                                        resourceSchemas={this.props.resourceSchemas}
                                                        resource={resourceName}
                                                        formatResourceScreenName={(resourceName) => {
                                                            return resourceName;
                                                        }}
                                                        {...screen}
                                                    />

                                                }
                                            </Tab.Screen>
                                        )
                                    })}
                                </Tab.Navigator>
                            }
                        </Stack.Screen>
                        {this.props.screens.items.filter((screen) => {
                            return !screen.inTabNavigation;
                        }).map((subScreen, j) => {
                            console.log('ScreenStackNavigator subScreen', subScreen)

                            const ScreenComponent = ScreenComponents[subScreen.type];
                            const screenName = subScreen.name ? subScreen.name : 'Naam';
                            const resourceName = subScreen.type === 'resource' ? subScreen.name : false;


                            return (
                                <Stack.Screen name={screenName} key={j}>
                                    {props =>
                                        <ScreenComponent
                                            {...props}
                                            resourcesData={this.props.resourcesData}
                                            resources={this.props.resources}
                                            resourceSchemas={this.props.resourceSchemas}
                                            resource={resourceName}
                                            screenName={screenName}
                                            {...subScreen}
                                        />
                                    }
                                </Stack.Screen>
                            )
                        })}
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        )
    }
}


export default GenericApp;
