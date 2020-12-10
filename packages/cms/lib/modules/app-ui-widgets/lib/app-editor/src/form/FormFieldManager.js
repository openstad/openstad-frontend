import React from 'react';
import { Title, RichText, Images, Button, Video, Overview, Form, Columns, Game, Tour, Login, Splash } from './components';
import { View, Text } from "react-native";

const componentstMap = {
  'AudioUploadField'   :{
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

function FormFieldManager(props) {
  return (
    <>
      {props.components.map((component)  => {
        const FormField = componentstMap[component.type].component;

        // allow per app to inject components, mainly used for allowing editing components to be injected without needing to be present in the frontend app itself
        const preCompononent =  ?
        const postCompononent =  ?

        return (
          <>
            <FormField
              {...component.props}
              activeResource={props.activeResource}
              resources={props.resources}
              navigation={props.navigation}
            />
          </>
        )
      })}
    </>
  );
}

export default FormFieldManager;
