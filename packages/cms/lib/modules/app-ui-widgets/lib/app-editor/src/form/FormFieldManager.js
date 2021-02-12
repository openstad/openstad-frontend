import React from 'react';
import { AudioUploadField, ImagesUploadField, TextField, LocationPicker, ObjectField, SelectField } from './components';
import PropTypes from "prop-types";

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
  'textarea': {
    component :TextField,
  },
  'select': {
    component :SelectField,
  },
  'object': {
    component :ObjectField,
  },
  'relationship': {
    component :TextField,
  },
  'price': {
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
        const label = field.label ? field.label : fields.key.ucfirst();
        // allow per app to inject components, mainly used for allowing editing components to be injected without needing to be present in the frontend app itself
        return (
          <Section title={field.label}>
            {FormField && <FormField
              {...field}
              activeValue={activeResource ? props.activeResource[field.key] : null}
              activeResource={props.activeResource}
              update={(value) => {
                props.update(field.key, value)
              }}
            />}
          </Section>
        )
      })}
    </>
  );
}

FormFieldManager.propTypes = {
  fields: PropTypes.array.isRequired,
  // for new resources always a default one is created so never empty
  activeResource: PropTypes.object.isRequired,
  update: PropTypes.func
}

export default FormFieldManager;
