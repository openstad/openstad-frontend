/* Layout elements */
import React, { Component } from 'react';
import { ComponentManager } from '../ComponentManager';
import { View } from "react-native";

class StaticScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <View>
        <ComponentManager
          components={props.components}
        />
      </View>
    )
  }
}

export default StaticScreen;
