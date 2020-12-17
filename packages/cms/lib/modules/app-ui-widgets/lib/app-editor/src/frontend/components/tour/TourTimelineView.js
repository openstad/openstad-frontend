import React, { Component, useLocation } from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import Accordeon from '../Accordeon';
import Fotorama from './Fotorama';

const styles = {
  h1 : {
    fontSize: 22
  },
  h2 : {
    fontSize: 18
  },
  p  : {
    fontSize: 12
  },
  small : {
    fontSize: 11
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

          {props.steps && props.steps.map((step, i) => {
            return (
                <Accordeon
                  title={
                    <Text style={styles.h2}> <Text style={styles.small}>Location {i + 1}</Text> {step.title}</Text>
                  }
                >
                {step.images && step.images[0] && <img src={step.images[0]} />}

                <Text style={styles.h2}>{step.title}</Text>
                <Text style={styles.p}>{step.description}</Text>
                <View style={{
                  display: 'flex',
                }}>

                  {props.step.images &&
                  <Fotorama
                     imp
                     data-allowfullscreen="true"
                     data-width="100%"
                     data-arrows="always"
                     data-min-width="100%"
                     data-ratio="500/250"
                     data-maxheight="250"
                     data-fit="cover"
                     data-loop="true"
                     data-keyboard="true"
                     data-transition="slide"
                  >
                    {props.step.images.map((image) => {
                      return <img src={image} />
                    })}
                  </Fotorama>
                  }

                  {props.step.audio && props.step.audio.file ?
                  <Button onPress={() => { props.playAudio(step.id) }}>
                    <img src="/play-circle.svg" /> Play Audio
                  </Button>
                  :
                  <small> This step has no audio </small>
                  }



                  <TouchableHighlight onPress={() => { props.playAudio(step.id) }}>
                    Read more
                  </TouchableHighlight>
                </View>
              </Accordeon>
            )
          })}

      </div>
    </div>
  )
}

export default TourTimelineView;
