import React, { Component, useLocation } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import Accordeon from '../Accordeon';
import TourDetailView from './TourDetailView';
import styles from './styles';


function TourTimelineView (props) {

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
            <Text style={styles.small}>
              <Text style={{marginRight: 10}}>
                <Image source={require('../../../images/walking@2x.png')} style={{height: 11, width: 6, marginRight: 4}}/>
                {props.tour.transportType}
              </Text>
              <Text  style={{marginRight: 10}}>
                <Image source={require('../../../images/clock@2x.png')} style={{height: 9, width: 9, marginRight: 4, top: 1}}/>
                {props.tour.duration}
              </Text>
              <Text>
                {props.tour.language}
              </Text>
            </Text>
            <Text style={{...styles.p, marginTop: 18, marginBottom: 18}}>{props.tour.description}</Text>
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
                  style={{
                    paddingBottom: props.steps.length === (i + 1) ? 0 : 10
                  }}
                  title={
                    <Text style={{fontWeight: 'bold', alignItems: 'center'}}>
                      <Text style={{...styles.small, color: '#333d48', paddingRight: 7, paddingTop: 4, paddingBottom: 5}}>Location {i + 1}</Text>
                      <Text style={{...styles.h2, ...styles.noPreWrap, display: 'inline'}}> {step.title} </Text>
                    </Text>
                  }
                >
                  <TourDetailView
                    step={step}
                    playAudio={props.playAudio}
                    openGallery={props.openGallery}
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
