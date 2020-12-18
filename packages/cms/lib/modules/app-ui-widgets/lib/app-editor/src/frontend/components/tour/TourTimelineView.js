import React, { Component, useLocation } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
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
    color: theme.emphasisedTextColor
  },
  greyBackground : {
    background: theme.backgroundColor
  },
  whiteBackground : {
    background: '#FFFFFF'
  },
  contentContainer : {
    padding: 15
  },
  timelineContainer: {
    paddingLeft: 30
  },
  timeline : {
    position: 'absolute',
    width: 2,
    top: 25,
    left: 15,
    bottom: 15,
    background: theme.primaryColor
  },
  outlinedButton: {
    color: theme.primaryColor,
    backgroundColor: 'transparant',
    borderColor: theme.primaryColor,
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
    fontSize: 12
  },
  colFifty: {
    width: '50%',
    display: 'block'
  }
}

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
            <Text style={styles.small}>{props.tour.transportType} | {props.tour.duration}  | {props.tour.language } </Text>
            <Text style={styles.p}>{props.tour.description}</Text>
          </View>
          <View style={{
            ...styles.contentContainer,
            ...styles.timelineContainer
          }}>
          <View style={styles.timeline} />

          {props.steps && props.steps.map((step, i) => {
            console.log('step', step)
            return (
                <Accordeon
                  title={
                    <Text style={styles.h2}> <Text style={styles.small}>Location {i + 1}</Text> {step.title}</Text>
                  }
                >
                <View style={{
                  display: 'flex',
                }}>

                  {props.step.images &&
                    <View style={{display: 'flex'}}>
                    {props.step.images.map((image, i) => {
                      return (
                        <View>
                          <Image source={{uri: image}} className="border-image" style={{
                            width: 50,
                            height: 50,
                            borderRadius: 10
                          }} />

                        </View>
                      )
                    })}
                    </View>
                  }
                  <Text style={styles.p}>{step.description}</Text>

                  <View style={{display: 'flex'}}>
                    <View style={styles.colFifty}>
                      {step.audio && step.audio.filename ?
                      <TouchableOpacity onPress={() => { props.playAudio(step.id) }} style={styles.outlinedButton}>
                        <Image uri={{uri:'/play-circle.svg'}} /> Play Audio
                      </TouchableOpacity>
                      :
                      <small> This step has no audio </small>
                      }
                    </View>
                    <View style={styles.colFifty}>
                      <TouchableOpacity onPress={() => { props.backToMap(step.id) }}>
                        <Text style={{...styles.h2}}> Show on map more </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
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
