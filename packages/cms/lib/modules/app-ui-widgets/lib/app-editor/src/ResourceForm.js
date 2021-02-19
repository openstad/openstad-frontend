import React, {Component} from 'react';
import FormFieldManager from './form/FormFieldManager';

import resourceSchemas from './config/resourceSchemas';

class ResourceForm extends Component {
    render() {
        console.log()
        const resourceSchema = resourceSchemas[this.props.resourceName];

        if (!resourceSchema) {
            return <div>No valid resource type found for: {this.props.resourceName}</div>
        }

        // for now all updates are local,
        // in the future we will add external
        // "saves"
        return(
            <form>
                {resourceSchema.description && <div className={"info-container"}>
                    {resourceSchema.description}
                </div>}
                <FormFieldManager
                    activeResource={this.props.activeResource}
                    fields={resourceSchema.fields}
                    update={this.props.update}
                />
            </form>
        )
    }
}

export default ResourceForm;
