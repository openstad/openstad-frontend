import React, {Component} from 'react';
import FormFieldManager from './FormFieldManager';

class ObjectField extends Component {
    new() {
        const values = this.props.activeValue ? this.props.activeValue : [];

        const newItem = {};
        values.push(newItem);

        this.update(values)
    }

    render() {
        const values = this.props.activeValue ? this.props.activeValue : [{}];

        return <>
            {values.map((activeValue, i) => {
                return <FormFieldManager
                    update={(key, value) => {
                        console.log('Update ObjectField');
                        console.log('Update ObjectField i', values[i]);


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
            })}
            <a href="#" className="plus-icon" onClick={this.props.new.bind(this)}> +</a>
        </>
    }
}

export default ObjectField;
