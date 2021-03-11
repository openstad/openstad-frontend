import React, { Component, useLocation } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import theme from './theme';

const styles = {
  open: {

  },
  closed: {
    marginBnottom: 20
  },
  title: {
    paddingLeft: 5,
    paddingTop: 5
  },
  toggleIcon: {
    width: 8,
    height: 5,
  },
  primaryColorCircle: {
    background: theme.primaryColor,
    width: 18,
    height: 18,
    borderWidth: 3,
    borderColor: theme.primaryColor,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 16,
    paddingTop: 4,
    paddingLeft: 2,
    boxShadow: '0 2px 4px 0 rgba(51, 61, 72, 0.15)'
  },
  toggleIconPosition: {
    position: 'absolute',
    left: -23,
    top: 4,
  },
  toggleCircleOpen: {
    borderColor: 'white',
    borderWidth: 3,
    paddingLeft: 5,
    paddingTop: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    left: -26,
    top: 2
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
   const toggleStyles = this.state.open ? styles.open : styles.closed;

   return (
     <View style={{...toggleStyles, ...this.props.style}}>
        {this.state.open && <View style={{...styles.primaryColorCircle, ...styles.toggleIconPosition, ...styles.toggleCircleOpen}}> <Image style={styles.toggleIcon} source={require('../../images/chevron-up-white@2x.png')} /> </View>}
        {!this.state.open && <View style={{...styles.primaryColorCircle, ...styles.toggleIconPosition}}>  <Image style={styles.toggleIcon} source={require('../../images/chevron-down-white@2x.png')} /></View>}
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
