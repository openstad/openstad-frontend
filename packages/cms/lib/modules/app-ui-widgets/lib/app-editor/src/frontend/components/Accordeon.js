import React, { Component, useLocation } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

const styles = {
  open: {

  },
  closed: {

  },
  title: {

  },
  toggleIcon: {
    width: 20,
    height: 20
  }
};

class Accordion extends Component {
 render () {
   return (
     <View style={this.state.open ? styles.open : styles.closed}>
        {this.state.open && <Image style={styles.toggleIcon} source={{uri: '/open-icon.svg'}} />}
        {!this.state.open && <Image style={styles.toggleIcon} source={{uri: '/closed-icon.svg'}} />}
        <TouchableHighlight onPress={() => {
          this.setState({
            open: this.state && this.state.open ? false : true
          })
        }}>
            <View style={styles.title}> {this.props.title} </View>
        </TouchableHighlight>
        {this.state.open && <View style={styles.contentContainer}> {this.props.children} </View>}
     </View>
   )
 }
}
