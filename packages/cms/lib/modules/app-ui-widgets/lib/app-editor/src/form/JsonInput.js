/**
 * Proof of concept working with Json Input, needs some work
 */

// in LatLongInput.js
import { Field } from 'react-final-form';
import React, { Component } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';

// Our app
class JsonInput extends Component {
  render() {
    return (
      <Field name={this.props.source}>
      {(fieldProps) => {
        const json =  fieldProps.input.value ? fieldProps.input.value : {};

        return (
          <JSONInput
            id          = 'ideaExtraData'
            placeholder = { json }
            locale      = { locale }
            height      = '550px'
            width       = '100%'
            onChange={(value)=>{
              if (value.jsObject) {
                fieldProps.input.onChange( value.jsObject );
              }
            }}
        />
      )}}
      </Field>
    )
  }
}

export default JsonInput;
