import React, {Component} from 'react';
import FormFieldManager from './FormFieldManager';
import Section from "../editor-ui/layout/Section";

class ObjectField extends Component {
    new() {

        const values = this.props.activeValue ? this.props.activeValue : [];

        const newItem = {};

        values.push(newItem);

        this.props.update(values);
    }

    remove(index) {
        const values = this.props.activeValue ? this.props.activeValue : [];

        values.splice(index, 1);

        this.props.update(values);
    }

    render() {
        const values = this.props.activeValue ? this.props.activeValue : [{}];

        console.log('ObjectField in values', values);


        return <>
            {values.map((activeValue, i) => {
                return <div>
                    <Section style={{textAlign: 'right'}} collapsible={false}>
                        <a href="#" style={{fontSize: '16px', color: '#8f8f8f'}} className="plus-icon" onClick={(ev) => {
                            ev.preventDefault();
                            this.remove(i);
                        }}> ✕ </a>
                    </Section>
                    <FormFieldManager
                        resources={this.props.resources}
                        update={(key, value) => {

                            console.log('ObjectField in key', key);
                            console.log('ObjectField in value', value);
                            console.log('ObjectField in values[i]', values[i]);
                            console.log('ObjectField in values[i][key]', values[i][key]);

                            if (values[i]) {
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
                this.new();
            }}> +</a>
        </>
    }
}

export default ObjectField;
