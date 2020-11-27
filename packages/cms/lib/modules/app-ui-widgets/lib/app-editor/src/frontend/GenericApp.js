/* Layout elements */
import React, { Component } from 'react';
import { StaticScreen, ResourceScreen, LoginScreen, SplashScreen } from './screens';
import { Switch,  } from "react-router";
import { View } from "react-native-web";

/*
screen = {
  type: resource|static|login,
  resourceType:
  id:
}
*/

const ScreenComponents = {
  'static' => StaticScreen,
  'resource' => ResourceScreen,
  'login' => LoginScreen,
  'splash' => SplashScreen
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
    }) ;
  }

  render() {
    const startScreenId = this.props.screens.startScreenId;

    if (!startScreenId)  {
      return <View> <Text> Start screen not selected </Text> </View>'                               '
    }

    return (
      <View>
        <Switch>
          {this.props.screens.items.map((screen) => {
            let path;

            if (startScreenId === screen.id) {
              path = '/';
            } else if (screen.type === 'resource' ) {
              path = `/${screen.resourceType}/:resourceId`;
            } else {
              path = `/page/${screen.id}`
            }
\
            <Route path={path}>
              <ScreenComponents[screen.type]
                {...screen}
              />
            </Route>
          })}
        </Switch>
      </View>
    )
  }
}

export default GenericApp=;
