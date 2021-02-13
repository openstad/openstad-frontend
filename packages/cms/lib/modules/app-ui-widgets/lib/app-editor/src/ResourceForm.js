import React, {Component} from 'react';
import FormFieldManager from './form/FormFieldManager';

const resourceSchemas = './resourceSchemas';

class ResourceForm extends Component {
    render() {
        const resourceSchema = resourceSchemas[this.props.resourceName];

        if (!resourceSchema) {
            return <div>No valid resource type found</div>
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
                />
            </form>
        )
    }
}

export default ResourceForm;
