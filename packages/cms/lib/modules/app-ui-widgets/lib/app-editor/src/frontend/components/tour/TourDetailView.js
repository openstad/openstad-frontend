import React, { Component, useLocation } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import Accordeon from '../Accordeon';
import styles from './styles';

export default class TourDetailView  extends Component {
  constructor(props) {
    super(props);

    this.state = {
      galleryInitialImage: false,
    };
  }

  render () {
    const {step, playAudio, backToMap} = this.props;
    const amountOfImagesInitially = 3;

    return (
      <View style={{paddingTop: 15, paddingBottom: 15, paddingLeft: 5}}>
          {step.images &&
            <View style={styles.colContainer}>
            {step.images.slice(0, (amountOfImagesInitially)).map((image, i) => {
              return (
                <TouchableOpacity
                  style={{...styles.colThird}}
                  onPress={() => {
                    this.props.openGallery(step.images.map((image) => {
                      return { source: { uri: image } };
                    }), i)
                  }}
                >
                  <Image
                    source={{uri: image}}
                    resizeMode="cover"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 10,
                      boxShadow: '0 -2px 19px 0 rgba(51, 61, 72, 0.1)'
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
                    }}>
                      +{(step.images.length - amountOfImagesInitially)}
                    </Text>
                  }
                </TouchableOpacity>
              )
            })}

            </View>
          }

          <Text style={{...styles.p, paddingBottom: 15}}>{step.description}</Text>

          <View style={styles.colContainer}>
            <View style={styles.colFifty}>
              {step.audio && step.audio.filename ?
              <TouchableOpacity onPress={() => { playAudio(step.id) }} style={styles.outlinedButton}>
                <Image uri={{uri:'/play-circle.svg'}} /> Play Audio
              </TouchableOpacity>
              :
              <small> This step has no audio </small>
              }
            </View>
            <View style={styles.colFifty}>
              <TouchableOpacity onPress={() => { backToMap(step.id) }}>
                <Text style={{...styles.h2, textAlign: 'center', 'textDecoration' : 'underline'}}>Show on map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    )
  }
}
