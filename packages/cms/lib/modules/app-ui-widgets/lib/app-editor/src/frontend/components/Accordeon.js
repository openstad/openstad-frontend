import React, { Component, useLocation } from 'react';
import { View, Text } from 'react-native';


const styles = {
  open: {

  }

};

class Accordion extends Component {
 render () {
   return (
     <View style={this.state.open ? styles.open : styles.closed}>
        {this.state.open && <Image style={styles.toggleIcon} source={{uri: '/open-icon.svg'}} />
        {!this.state.open && <Image style={styles.toggleIcon} source={{uri: '/closed-icon.svg'}} />
        {this.state.open && <View style={styles.contentContainer}> {this.props.title} </View>}
     </View>
   )
 }
}
