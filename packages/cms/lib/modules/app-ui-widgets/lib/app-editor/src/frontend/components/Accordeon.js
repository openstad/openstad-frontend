import React, { Component, useLocation } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

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
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open,
    };
  }


 render () {
   return (
     <View style={this.state.open ? styles.open : styles.closed}>
        {this.state.open && <Image style={styles.toggleIcon} source={{uri: '/open-icon.svg'}} />}
        {!this.state.open && <Image style={styles.toggleIcon} source={{uri: '/closed-icon.svg'}} />}
        <TouchableOpacity onPress={() => {
          this.setState({
            open: !this.state.open
          })
        }}>
          <View style={styles.title}> {this.props.title} </View>
        </TouchableOpacity>
        {this.state.open && <View style={styles.contentContainer}> {this.props.children} </View>}
     </View>
   )
 }
}

export default Accordion;
