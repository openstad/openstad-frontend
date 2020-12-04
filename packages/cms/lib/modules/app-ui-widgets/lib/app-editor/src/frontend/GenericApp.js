/* Layout elements */
import React, { Component } from 'react';
import { StaticScreen, ResourceScreen, LoginScreen, SplashScreen, SignInScreen, SignUpScreen } from './screens';
import { Logo } from './layout';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { View, Text } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();


/*
screen = {
  type: resource|static|login,
  resourceType:
  id:
}
*/

const ScreenComponents = {
  'static' : StaticScreen,
  'resource' : ResourceScreen,
  'login' : LoginScreen,
  'splash' : SplashScreen
}

class GenericApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStepId: null,
    };

  }

  handleHashChange() {
    var location =  window.location;
    var hash = location.hash;
    var activeStepId;

    if (hash.startsWith('#step-detail')) {
      activeStepId = parseInt(hash.replace('#step-detail-', ''), 10);
    }

    this.setState({
      activeStepId: activeStepId
    });
  }

  render() {
    const startScreenId = this.props.screens.startScreenId;


    if (!startScreenId)  {
      return (
        <View>
          <Text> Start screen not selected </Text>
        </View>
      );
    }

    console.log('this.props.styling.header', this.props.styling)

    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
              headerTitle: props => <Logo {...this.props.styling.header.logo} />,
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}
        >
          {this.props.isSignedIn ? (
            <>
            {this.props.screens.items.map((screen) => {
              let path;

              if (startScreenId === screen.id) {
                path = '/';
              } else if (screen.type === 'resource' ) {
                path = `/${screen.resourceType}/:resourceId`;
              } else {
                path = `/page/${screen.id}`
              }

              const ScreenComponent = ScreenComponents[screen.type];
              const screenComponent = <ScreenComponent resources={this.props.resources} resource={screen.resourceType} {...screen} />
              const screenName = screen.name ? screen.name : 'Naam';

              return (
                <Stack.Screen name={screenName}>
                    {props => screenComponent}
                </Stack.Screen>
              )
            })}
          </>)
          :
          (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
          )}
          </Stack.Navigator>
      </NavigationContainer>
    )
  }
}


export default GenericApp;
