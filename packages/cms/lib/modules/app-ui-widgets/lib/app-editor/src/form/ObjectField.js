import React, { Component } from 'react';
import FormFieldManager from './FormFieldManager';

class ObjectField extends Component {
  render () {
      const values = this.props.activeValue ? this.props.activeValue : [];

      return <>
          {values.map((values) => {
              return <FormFieldManager
                  update={(value) => {
                      // current implementation only works one level nested
                      props.update({
                          ...this.props.activeValue,
                          [this.props.key]: value
                      })
                  }}
                  // in this case the active resource is not anymore the top level.
                  activeResource={this.props.activeValue}
                  fields={props.fields}
              />
          })}
          <a href="#" className="plus-icon" onClick={props.new}> +</a>

      </>
  }
}

export default ObjectField;
