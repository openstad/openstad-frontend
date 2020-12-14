import React, { Component } from 'react';
import { options as styleOptions } from '../../config/styles';

const StyleSelect = ({key}) => {
  return (
    <select>
      {styleOptions.map((style) => {
        return <option selected={style.key === value}> {style.label} </option>;
      })}
    </select>
  )
}

const StyleField = ({style}) => {
  return (
    <div>
      <StyleSelect key={style.key} />
      <div>
        {style.value}
      </div>
    </div>
  )
}

class StylesField extends Component {

  render() {
    const {styles} = this.props;

    return (
      <div class="styles-field">
        {styles.map((style) => {
          return <StyleField style={style} />
        })}
      </div>
    )
  }
}

export default StylesField
