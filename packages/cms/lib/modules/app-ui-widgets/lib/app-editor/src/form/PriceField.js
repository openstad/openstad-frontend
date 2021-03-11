import React, {Component} from 'react';

class PriceField extends Component {
    render() {
        return (
            <input
                type="text"
                name={this.props.key}
                defaultValue={this.props.activeValue}
                onChange={(event) => {
                    update(this.props.resource, 'title', event.currentTarget.value)
                }}
            />
        )
    }
}

export default PriceField;
