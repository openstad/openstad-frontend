/* Layout elements */
import React, { Component } from 'react';
import { ComponentManager } from '../ComponentManager';
import { View } from "react-native-web";


class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <View>
        <ComponentManager
          components={props.components}
          componentProps={{
            resource: true
          }}
        />
      </View>
    )
  }
}

export default LoginScreen=;
