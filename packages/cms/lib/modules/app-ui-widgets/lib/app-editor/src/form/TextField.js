import React, { Component } from 'react';


class TextField extends Component {
  render () {
    return (
      <>
        {this.props.textarea ?
          <textarea
            type=""
            name="title"
            defaultValue={this.props.resource.data.description}
            onChange={(event) => {
              this.props.update(currentTarget.value)
            }}
          />
          :
          <input
            type=""
            name="title"
            defaultValue={this.props.resource.data.title}
            onChange={(event) => {
              this.props.update(currentTarget.value)
            }}
         />
       }
      </>
    )
  }
}

export default TextField;
