import React, {Component} from 'react';
import FormFieldManager from './FormFieldManager';

class ObjectField extends Component {
    new() {
        const values = this.props.activeValue ? this.props.activeValue : [];

        const newItem = {};

        values.push(newItem);

        console.log('this.props.update', this.props.update)
        this.props.update(values);
    }

    render() {
        const values = this.props.activeValue ? this.props.activeValue : [{}];

        return <>
            {values.map((activeValue, i) => {
                return <div>
                    <h1>formfield</h1>
                    <FormFieldManager
                        resources={this.props.resources}
                        update={(key, value) => {

                            if (values[i] && values[i][key]) {
                                console.log('Update ObjectField i key', values[i][key]);

                                values[i][key] =  value;

                                // current implementation only works one level nested
                                this.props.update(values);
                            }
                        }}
                        // in this case the active resource is not anymore the top level.
                        activeResource={activeValue}
                        fields={this.props.fields}
                    />
                </div>
            })}
            <a href="#" className="plus-icon" onClick={(ev) => {
                ev.preventDefault();
                this.new.bind(this)
            }}> +</a>
        </>
    }
}

export default ObjectField;
