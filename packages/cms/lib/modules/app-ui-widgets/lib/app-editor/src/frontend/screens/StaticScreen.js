/* Layout elements */
import React, { Component } from 'react';
import ComponentManager from '../ComponentManager';
import { View, Text } from "react-native";

class StaticScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {

    return (
      <View>
        <ComponentManager
          {...this.props}
        />
      </View>
    )
  }
}

export default StaticScreen;
