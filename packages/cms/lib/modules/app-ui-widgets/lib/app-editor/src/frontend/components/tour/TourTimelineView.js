import React, { Component, useLocation } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import Accordeon from '../Accordeon';
import TourDetailView from './TourDetailView';
import styles from './styles';

function TourTimelineView (props) {
  const amountOfImagesInitially = 3;

  return (
      <div className="tour-detail-view" style={{
        ...styles.greyBackground
      }}>
        <div className="tour-detail-view-inner">
          <a href="#" className="tour-detail-view-close">✕</a>
          <View style={{
            ...styles.contentContainer,
            ...styles.whiteBackground
          }}>
            <Text style={{...styles.small, opacity: 0.8}}>{props.tour.location}</Text>
            <Text style={styles.h1}>{props.tour.title}</Text>
            <Text style={styles.small}>{props.tour.transportType} | {props.tour.duration}  | {props.tour.language } </Text>
            <Text style={styles.p}>{props.tour.description}</Text>
          </View>
          <View style={{
            ...styles.contentContainer,
            ...styles.timelineContainer
          }}>
          <View style={styles.timeline} />

          {props.steps && props.steps.map((step, i) => {
            return (
                <Accordeon
                  open={props.activeStep.id === step.id}
                  title={
                    <Text style={{...styles.h2, ...styles.noPreWrap}}> <Text style={styles.small}>Location {i + 1}</Text> {step.title}</Text>
                  }
                >
                  <TourDetailView
                    step={step}
                  />
              </Accordeon>
            )
          })}
          </View>

      </div>
    </div>
  )
}

export default TourTimelineView;
