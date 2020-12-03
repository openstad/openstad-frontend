import React from 'react';
import { Title, RichText, Images, Button, Video, Overview, Form, Columns, Game, Tour, Login, Splash } from './components';
import { View, Text } from "react-native";

const componentstMap = {
  'title'   :{
    component: Title,
  },
  'richText'    : {
    component: RichText,
  },
  'image'   : {
    component :Image,
  },
  'button'  : {
    component :Button,
  },
  'video'  : {
    component :Video,
  },
  'overview'  : {
    component :Overview,
  },
  'form'  : {
    component :Form,
  },
  'column'   : {
    component :Columns,
  },
  'game'   :{
    component :Game,
  },
  'tour'   : {
    component :Tour,
  },
  'map'   : {
    component :Map,
  },
  'login'   : {
    component :Login,
  },
  'splash'   : {
    component :Splash,
  }
}

function ComponentManager(props) {
  const className = props.active ? 'ListItem active' : 'ListItem';

  return (
    <View props={className}>
      {props.components.map((component)  => {
        const FrontendComponent = componentstMap[component.type].component;
        console.log('component.prop', component.props)


        return (<FrontendComponent
          {...component.props}
          resources={props.resources}
        />)
      })}
    </View>
  );
}

export default ComponentManager;
