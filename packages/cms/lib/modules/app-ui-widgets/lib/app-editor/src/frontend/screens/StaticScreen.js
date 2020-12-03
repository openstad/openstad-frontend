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
    console.log('StaticScreen', this.props)
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
