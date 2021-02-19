/* Layout elements */
import React, {Component} from 'react';
import {StaticScreen, ResourceScreen, LoginScreen, SplashScreen, SignInScreen, SignUpScreen} from './screens';
import {Logo} from './layout';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Platform, StyleSheet} from "react-native";
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
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

        const linking = {
            ///  prefixes: ['https://mychat.com', 'mychat://'],
            config: {
                screens: {
                    game: 'game/:id',
                },
            },
        };

        return (
            <View style={{
                height: Platform.OS === 'web' ? '100%' : '100%',
                backgroundColor: 'red',
                flex: 1
                //  ...this.props.styling.body.styles
            }}>
                {/*
                <NavigationContainer linking={linking}>
                    <Stack.Navigator
                        screenOptions={{
                            headerTitle: props => <Logo {...this.props.styling.header.logo} />,
                            headerTitleAlign: 'center',
                            headerStyle: this.props.styling.header,
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    >
                        {this.props.isSignedIn ? (
                                <>
                                    {this.props.screens.items.map((screen) => {

                                        const ScreenComponent = ScreenComponents[screen.type];
                                        const screenName = screen.name ? screen.name : 'Naam';
                                        const resourceName = screen.type === 'resource' ? screen.name : false;

                                        return (
                                            <>
                                                <Stack.Screen name={screenName}>
                                                    {props =>
                                                        <ScreenComponent
                                                            {...props}
                                                            resources={this.props.resources}
                                                            resource={resourceName}
                                                            {...screen}
                                                        />
                                                    }
                                                </Stack.Screen>

                                            </>
                                        )
                                    })}
                                </>)
                            :
                            (
                                <>
                                    <Stack.Screen name="SignIn" component={SignInScreen}/>
                                    <Stack.Screen name="SignUp" component={SignUpScreen}/>
                                </>
                            )}
                    </Stack.Navigator>
                </NavigationContainer>
                */}
                <NavigationContainer
                    linking={linking}
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
                        }).map((screen) => {
                            const ScreenComponent = ScreenComponents[screen.type];
                            const resourceName = screen.type === 'resource' ? screen.name : false;
                            const Stack = createStackNavigator();

                            return (
                                <Tab.Screen
                                    name={screen.name}
                                >
                                    {props =>
                                        <Stack.Navigator
                                            screenOptions={{
                                                headerTitle: props => <Logo {...this.props.styling.header.logo} />,
                                                headerTitleAlign: 'center',
                                                headerStyle: this.props.styling.header,
                                                headerTintColor: '#fff',
                                                headerTitleStyle: {
                                                    fontWeight: 'bold',
                                                },
                                            }}
                                        >
                                            <Stack.Screen name={screen.name}>
                                                {props =>
                                                    <ScreenComponent
                                                        {...props}
                                                        resourcesData={this.props.resourcesData}
                                                        resourceSchemas={this.props.resourceSchemas}
                                                        resource={resourceName}

                                                        {...screen}
                                                    />
                                                }
                                            </Stack.Screen>
                                        </Stack.Navigator>
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
