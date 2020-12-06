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

    this.state = {};

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
          ...styles.fullHeight,
          ...this.props.styling.body
        }}>
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            screenOptions={{
                headerTitle: props => <Logo {...this.props.styling.header.logo} />,
                headerTitleAlign: 'center',
                headerStyle:    this.props.styling.header,
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
                const screenName = screen.name ? screen.name : 'Naam';
                const resourceName = screen.type === 'resource' ? screen.name : false;

                console.log('screen', screen)
                console.log('screenName', screenName)

                return (
                  <Stack.Screen name={screenName}>
                      {props => <ScreenComponent {...props} resources={this.props.resources} resource={resourceName} {...screen}  />}
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
