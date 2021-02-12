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
              update(this.props.resource, 'description', event.currentTarget.value)
            }}
          />
          :
          <input
            type=""
            name="title"
            defaultValue={this.props.resource.data.title}
            onChange={(event) => {
              update(this.props.resource, 'title', event.currentTarget.value)
            }}
         />
       }
      </>
    )
  }
}

export default TextField;
