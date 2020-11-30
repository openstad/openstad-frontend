import React from 'react';
import { Title, Text, Images, Button, Video, Overview, Form, Grid, Game, Tour, Login, Splash } from '/components';
import { View } from "react-native";

const componentstMap = {
  'title'   :{
    component Title,
  },
  'text'    : {
    component Text,
  },
  'image'   : {
    component Image,
  },
  'button'  : {
    component Button,
  },
  'video'  : {
    component Video,
  },
  'overview'  : {
    component Overview,
  },
  'form'  : {
    component Form,
  },
  'grid'   : {
    component Grid,
  },
  'game'   :{
    component Game,
  },
  'tour'   : {
    component Tour,
  },
  'map'   : {
    component Map,
  }
  'login'   : {
    component Login,
  },
  'splash'   : {
    component Splash,
  }
}

function Game(props) {
  var className = props.active ? 'ListItem active' : 'ListItem';

  return (
    <View props={className}>
      {props.components.map(component : {
        <componentstMap[component.type].component
          {...props.componentProps}
          {...component.props}
        />
      })}
    </View>
  );
}

export default Game;
