import React from 'react';
import { Title, RichText, Images, Button, Video, Overview, Form, Columns, Game, Tour, Login, Splash } from './components';
import { View, Text } from "react-native";

const componentstMap = {
  'audio'   :{
    component: AudioUploadField,
  },
  'image'   : {
    component :ImagesUploadField,
  },
  'text'  : {
    component :TextField,
  },
  'location'  : {
    component : LocationPicker,
  }
}

function FormFieldManager(props) {
  return (
    <>
      {props.fields.map((field)  => {
        const FormField = componentstMap[field.type].component;

        // allow per app to inject components, mainly used for allowing editing components to be injected without needing to be present in the frontend app itself
        const preCompononent =  ?
        const postCompononent =  ?

        return (
          <Section title={field.label}>
            <FormField
              {...field.settings}
              activeResource={props.activeResource}
              resources={props.resources}
            />
          </Section>
        )
      })}
    </>
  );
}

export default FormFieldManager;
