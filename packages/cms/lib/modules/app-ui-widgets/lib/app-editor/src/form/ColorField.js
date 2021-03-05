import React, { Component } from 'react';

class ColorField extends Component {
  render () {
    return (
        <input
            type="color"
            defaultValue={this.props.activeValue}
            onChange={(event) => {
              this.props.update(event.currentTarget.value);
            }}
         />
    )
  }
}

export default ColorField;
