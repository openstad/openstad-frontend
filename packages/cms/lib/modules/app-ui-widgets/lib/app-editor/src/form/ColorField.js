import React, { Component } from 'react';

// ES6 code
function debounced(delay, fn) {
    let timerId;
    return function (...args) {
        if (timerId) {
            clearTimeout(timerId);
        }

        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    }
}

class ColorField extends Component {
    constructor() {
        super();

        this.state = {
            updating: false
        }
    }

      render () {
        return (
            <input
                type="color"
                defaultValue={this.props.activeValue}
                onBlur={(event) => {
                    this.props.update(event.currentTarget.value);
                }}
             />
        )
      }
}

export default ColorField;
