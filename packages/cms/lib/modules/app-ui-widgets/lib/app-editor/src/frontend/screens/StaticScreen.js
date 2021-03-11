/* Layout elements */
import React, { Component } from 'react';
import ComponentManager from '../ComponentManager';
import { View, Text, ScrollView } from "react-native";

const bodyStyles = {
  padding: 10,
  paddingTop: 40,
}

class StaticScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    console.log('ResourceScreen props', this.props)

    return (
      <ScrollView style={bodyStyles} showsVerticalScrollIndicator={false}>
        <ComponentManager
          {...this.props}
        />
      </ScrollView>
    )
  }
}

export default StaticScreen;
