import React, { Component, useLocation } from 'react';
import { View, Text, Button, TouchableHighlight, Image } from 'react-native';
import Accordeon from '../Accordeon';
import Fotorama from './Fotorama';
import theme from '../theme';

const styles = {
  h1 : {
    fontSize: 16,
    display: 'block',
    color: theme.emphasisedTextColor,
    marginTop: 10,
    marginBottom: 5
  },
  h2 : {
    fontSize: 16,
    display: 'block',
    color: theme.primaryColor
  },
  p  : {
    fontSize: 12,
    display: 'block',
    color: theme.defaultTextColor,
    marginTop: 10,
    marginBottom: 5
  },
  small : {
    fontSize: 11,
    color: theme.defaultTextColor
  },
  greyBackground : {
    background: theme.backgroundColor
  },
  whiteBackground : {
    background: '#FFFFFF'
  },
  contentContainer : {
    padding: 15
  }
}

function TourTimelineView (props) {
  console.log('theme', theme, styles)

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
            ...styles.contentContainer
          }}>
          {props.steps && props.steps.map((step, i) => {
            return (
                <Accordeon
                  title={
                    <Text style={styles.h2}> <Text style={styles.small}>Location {i + 1}</Text> {step.title}</Text>
                  }
                >
                <Text style={styles.p}>{step.description}</Text>
                <View style={{
                  display: 'flex',
                }}>

                  {props.step.images &&
                    <View style={{display: 'flex'}}>
                    {props.step.images.map((image, i) => {

                      return (
                        <View>
                          <Image source={{uri: image}} className="border-image" style={{
                            width: 80,
                            height: 80,
                            borderRadius: 10
                          }} />

                        </View>
                      )
                    })}
                    </View>
                  }

                  {props.step.audio && props.step.audio.file ?
                  <Button onPress={() => { props.playAudio(step.id) }}>
                    <img src="/play-circle.svg" /> Play Audio
                  </Button>
                  :
                  <small> This step has no audio </small>
                  }

                  <TouchableHighlight onPress={() => { props.playAudio(step.id) }}>
                    <Text> Show on map more </Text>
                  </TouchableHighlight>
                </View>
              </Accordeon>
            )
          })}
          </View>

      </div>
    </div>
  )
}

export default TourTimelineView;
