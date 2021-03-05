import React from 'react';
import {
    AudioUploadField,
    ImagesUploadField,
    TextField,
    LocationPicker,
    ObjectField,
    SelectField,
    RelationshipField,
    ColorField
} from './index';
import PropTypes from "prop-types";
import Section from '../editor-ui/layout/Section';

import {makeCamelCasePretty} from '../utils';

const componentstMap = {
    'audio': {
        component: AudioUploadField,
    },
    'image': {
        component: ImagesUploadField,
    },
    'text': {
        component: TextField,
    },
    'number': {
        component: TextField,
    },
    'textarea': {
        component: TextField,
    },
    'select': {
        component: SelectField,
    },
    'object': {
        component: ObjectField,
    },
    'relationship': {
        component: RelationshipField,
    },
    'price': {
        component: TextField,
    },
    'location': {
        component: LocationPicker,
    },
    'color': {
        component: ColorField,
    }
}

function checkFieldConditions(values, conditions) {
    let valid = true;

    console.log('conditions', conditions)
    console.log('valid 1', valid)
    console.log('values', values)

    conditions.forEach((condition) => {
        // for now it's and and and, so if one conditon fails valid is false
        if (valid) {
            console.log('condition.key', condition.key);
            console.log('condition.value', condition.value);

            console.log('values[condition.key]', values[condition.key]);
            console.log('values[condition.key] === condition.value', values[condition.key] === condition.value);

            valid = values[condition.key] === condition.value;
        }
    });

    console.log('valid 2', valid)

    return valid;
}

function FormFieldManager(props) {

    return (
        <>
            {props.fields.map((field, i) => {
                const FormField = componentstMap[field.type] ? componentstMap[field.type].component : false;
                const label = field.label ? field.label : makeCamelCasePretty(field.key);

                const displayConditionsMet = field.displayConditions ? checkFieldConditions(props.activeResource, field.displayConditions) : true;
                console.log('displayConditionsMet', displayConditionsMet);
                // allow per app to inject components, mainly used for allowing editing components to be injected without needing to be present in the frontend app itself
                return (
                    <>
                        {displayConditionsMet &&
                        <Section title={field.label} key={i}>
                            {FormField && <FormField
                                {...field}
                                activeValue={props.activeResource ? props.activeResource[field.key] : null}
                                activeResource={props.activeResource}
                                resources={props.resources}
                                update={(value) => {
                                    console.log('Update in FormFieldManager for key', field.key, ' for value ', field.value)
                                    props.update(field.key, value)
                                }}
                            />}

                        </Section>
                        }
                    </>
                )
            })}
        </>
    );
}

FormFieldManager.propTypes = {
    fields: PropTypes.array.isRequired,
    // for new resources always a default one is created so never empty
    activeResource: PropTypes.object.isRequired,
    update: PropTypes.func
}

export default FormFieldManager;
