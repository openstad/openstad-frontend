import React, { Component, useLocation } from 'react';
import { View, Text } from 'react-native';
import {}

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

function TourDetailView (props) {
  return (
      <div className="tour-detail-view">
        <div className="tour-detail-view-inner">
          <a href="#">X</a>
          <Text style={{...styles.small, opacity: 0,8}}>{props.tour.location}</Text>
          <Text style={styles.h1}>{props.tour.title}</Text>
          <Text style={styles.p}>{props.tour.description}</Text>
          <Text style={styles.small}>{props.tour.transportType | 'walking'} | {props.tour.duration | '1 hour'}  | {props.tour.language | 'english'} </Text>

          {props.steps && props.steps.map((step, i + 1) => {
            <Accordeon
              title={
                <Text style={styles.h2}> <Text style={styles.small}>Location{step.title}</Text> {step.title}</Text>
              }
            >
              {props.step.images && props.step.images[0] && <img src={props.step.images[0]} />}
              <Text style={styles.h2}>{props.step.title}</Text>
              <Text style={h1}>{props.step.description}</Text>
            </Accordeon>
          })}

      </div>
    </div>
  )
}

export default TourDetailView;
