import React, { Component } from 'react';


class TextField extends Component {
  render () {
    return (
      <>
        {this.props.textarea ?
          <textarea
            defaultValue={this.props.activeValue}
            onChange={(event) => {
              this.props.update(event.currentTarget.value)
            }}
          />
          :
          <input
            type="text"
            defaultValue={this.props.activeValue}
            onChange={(event) => {
              this.props.update(event.currentTarget.value);
            }}
         />
       }
      </>
    )
  }
}

export default TextField;
