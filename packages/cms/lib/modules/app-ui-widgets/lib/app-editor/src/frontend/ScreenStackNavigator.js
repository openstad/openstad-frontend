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
        //const ScreenComponent = ScreenComponents[this.props.screen.type];
       // const resourceName = this.props.screen.type === 'resource' ? this.props.screen.name : false;


        console.log('ScreenStackNavigator this.props', this.props.screens);

        return <>{/*<Stack.Screen name={this.props.screen.name}>
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
            })
            */}
            {this.props.screens.map((subScreen, j) => {
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
        </>
    }
}

export default ScreenStackNavigator;