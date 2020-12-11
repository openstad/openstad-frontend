import React from 'react';
import { AudioUploadField, ImagesUploadField, TextField, LocationPicker} from './components';
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
        const FormField =  componentstMap[field.type] ? componentstMap[field.type].component : false;

        // allow per app to inject components, mainly used for allowing editing components to be injected without needing to be present in the frontend app itself

        return (
          <Section title={field.label}>
            {FormField && <FormField
              {...field.settings}
              activeResource={props.activeResource}
              resources={props.resources}
            />}
          </Section>
        )
      })}
    </>
  );
}

export default FormFieldManager;
