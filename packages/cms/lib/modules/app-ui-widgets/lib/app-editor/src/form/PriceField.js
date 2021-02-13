import React, { Component } from 'react';


class PriceField extends Component {
    render () {
        return (
            <>
                <input
                    type=""
                    name="title"
                    defaultValue={this.props.resource.data.title}
                    onChange={(event) => {
                        update(this.props.resource, 'title', event.currentTarget.value)
                    }}
                />
            </>
        )
    }
}

export default PriceField;
