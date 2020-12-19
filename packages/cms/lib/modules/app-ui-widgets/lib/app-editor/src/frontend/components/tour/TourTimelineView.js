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
  colContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  colFifty: {
    width: '50%',
  },
  colThird: {
    width: '33.333%',
    paddingRight: 10
  },
  noPreWrap: {
    whiteSpace: 'normal'
  }
}

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
                <View>
                  {step.images &&
                    <View style={styles.colContainer}>
                    {step.images.slice(0, (amountOfImagesInitially)).map((image, i) => {

                      return (
                        <TouchableOpacity style={{...styles.colThird}}>
                          <Image
                            source={{uri: image}}
                            resizeMode="cover"
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 10
                            }}
                            />
                          {(i === (amountOfImagesInitially - 1) && step.images.length > amountOfImagesInitially) &&
                            <Text style={{
                              width: 80,
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              position: 'absolute',
                              fontWeight: 'bold',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              lineHeight: 80,
                              borderRadius: 10,
                              textAlign: 'center'
                            }}>+{(step.images.length - amountOfImagesInitially)}</Text>
                          }
                        </TouchableOpacity>
                      )
                    })}
                    </View>
                  }

                  <Text style={styles.p}>{step.description}</Text>

                  <View style={styles.colContainer}>
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
                        <Text style={{...styles.h2, textAlign: 'center'}}> Show on map more </Text>
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
