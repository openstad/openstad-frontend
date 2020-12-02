/* Layout elements */
import React, { Component } from 'react';
import { StaticScreen, ResourceScreen, LoginScreen, SplashScreen } from './screens';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { View, Text } from "react-native";

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


    return (
      <View>
      <Router>
        <Switch>
          {this.props.screens.items.map((screen) => {
            let path;
            const ScreenComponent = ScreenComponents[screen.type];

            if (startScreenId === screen.id) {
              path = '/';
            } else if (screen.type === 'resource' ) {
              path = `/${screen.resourceType}/:resourceId`;
            } else {
              path = `/page/${screen.id}`
            }

            return (
              <Route path={path}>
                <ScreenComponent
                  resources={this.props.resources}
                  resource={screen.resourceType}
                  {...screen}
                />
              </Route>
            )
          })}
        </Switch>
        </Router>

      </View>
    )
  }
}


export default GenericApp;
