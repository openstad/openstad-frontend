/* Layout elements */
import React, { Component } from 'react';
import ComponentManager from '../ComponentManager';
import { View, Text } from "react-native";


class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <View>
        <ComponentManager
          {...this.props}
          componentProps={{
            resource: true
          }}
        />
      </View>
    )
  }
}

export default LoginScreen;
