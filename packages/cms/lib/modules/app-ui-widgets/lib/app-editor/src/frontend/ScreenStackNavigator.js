import React, {Component} from "react";
import {createStackNavigator} from '@react-navigation/stack';
import {StaticScreen, ResourceScreen, LoginScreen, SplashScreen, SignInScreen, SignUpScreen} from './screens';

const Stack = createStackNavigator();


const ScreenComponents = {
    'static': StaticScreen,
    'resource': ResourceScreen,
    'login': LoginScreen,
    'splash': SplashScreen
}

class ScreenStackNavigator extends Component {
    render() {
        const ScreenComponent = ScreenComponents[this.props.screen.type];
        const resourceName = this.props.screen.type === 'resource' ? this.props.screen.name : false;

        return <Stack.Navigator
            screenOptions={{
                //headerTitle: props => <Logo {...this.props.styling.header.logo} />,
                //headerTitleAlign: 'center',
                //headerStyle: this.props.styling.header,
                //headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen name={this.props.screen.name}>
                {props =>
                    <ScreenComponent
                        {...props}
                        resourcesData={this.props.resourcesData}
                        resourceSchemas={this.props.resourceSchemas}
                        resource={resourceName}
                        formatResourceScreenName={(resourceName) => {
                            return this.props.screen.name + '-' + resourceName;
                        }}
                        {...this.props.screen}
                    />
                }
            </Stack.Screen>

            {this.props.screens.items.filter((subScreen) => {
                return !subScreen.inTabNavigation && subScreen.name;
            }).map((subScreen, j) => {
                const ScreenComponent = ScreenComponents[subScreen.type];
                const screenName = subScreen.name ? this.props.screen.name + '-' + subScreen.name : 'Naam';
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
    }
}

export default ScreenStackNavigator;