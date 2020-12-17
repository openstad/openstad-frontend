import React, { Component, useLocation } from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import Accordeon from '../Accordeon';

const styles = {
  overlay : {

  },
  h2 : {

  },
  p  : {

  },
  small : {

  }
}

function TourDetailView (props) {
  return (
      <div>
        <div className="tour-detail-view-inner">
          <a href="#">X</a>
          <h1> {props.activeStep.title} </h1>
      </div>
    </div>
  )
}

export default TourDetailView;
