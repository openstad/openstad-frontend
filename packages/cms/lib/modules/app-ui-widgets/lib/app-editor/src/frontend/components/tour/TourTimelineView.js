import React, { Component, useLocation } from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import Accordeon from '../Accordeon';

const styles = {
  h1 : {

  },
  h2 : {

  },
  p  : {

  },
  small : {

  }
}

function TourTimelineView (props) {
  return (
      <div className="tour-detail-view">
        <div className="tour-detail-view-inner">
          <a href="#">X</a>
          <Text style={{...styles.small, opacity: 0.8}}>{props.tour.location}</Text>
          <Text style={styles.h1}>{props.tour.title}</Text>
          <Text style={styles.p}>{props.tour.description}</Text>
          <Text style={styles.small}>{props.tour.transportType | 'walking'} | {props.tour.duration | '1 hour'}  | {props.tour.language | 'english'} </Text>

          {props.steps && props.steps.map((step, i + 1) => {
            <Accordeon
              title={
                <Text style={styles.h2}> <Text style={styles.small}>Location{step.title}</Text> {step.title}</Text>
              }
            >
              {step.images && step.images[0] && <img src={step.images[0]} />}
              
              <Text style={styles.h2}>{step.title}</Text>
              <Text style={p}>{step.description}</Text>
              <View style={{
                display: 'flex',
              }}>
                <Button onPress={() => { props.playAudio(step.id) }}>
                  Play Audio
                </Button>
                <TouchableHighlight onPress={() => { props.playAudio(step.id) }}>
                  Read more
                </TouchableHighlight>
              </View>
            </Accordeon>
          })}

      </div>
    </div>
  )
}

export default TourDetailView;
