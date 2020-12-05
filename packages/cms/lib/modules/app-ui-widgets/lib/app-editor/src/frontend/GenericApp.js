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
import { View, Text, Platform, StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

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
    const MyTheme = {
     ...DefaultTheme,
     colors: {
       ...DefaultTheme.colors,
       background: '#000',
     },
   };


    if (!startScreenId)  {
      return (
        <View>
          <Text> Start screen not selected </Text>
        </View>
      );
    }

    return (
        <View style={styles.fullHeight} >
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
                headerTitle: props => <Logo {...this.props.styling.header.logo} />,
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: this.props.styling.header.backgroundColor || '#000000',
                  elevation: 0, // remove shadow on Android
                  shadowOpacity: 0, // remove shadow on iOS
                  borderBottomWidth: 0,
                },
                cardStyle: {backgroundColor: this.props.styling.header.backgroundColor || '#000000', },
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
        </View>
    )
  }
}


export default GenericApp;
