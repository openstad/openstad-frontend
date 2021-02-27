/* Layout elements */
import React, { Component } from 'react';
import ComponentManager from '../ComponentManager';
import { View, Text, ScrollView } from "react-native";

class StaticScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    console.log('ResourceScreen props', this.props)

    return (
      <ScrollView>
        <ComponentManager
          {...this.props}
        />
      </ScrollView>
    )
  }
}

export default StaticScreen;
