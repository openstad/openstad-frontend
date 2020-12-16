import React, { Component, useLocation } from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import Accordeon from '../Accordeon';
import { Swiper, SwiperSlide } from 'swiper/react';

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
      <div style={}>
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
              <Text style={p}>{props.step.description}</Text>
              <View style={{
                display: 'flex',
              }}>
                <Button onPress={() => { props.playAudio(props.step.id) }}>
                  Play Audio
                </Button>
                <TouchableHighlight onPress={() => { props.playAudio(props.step.id) }}>
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
