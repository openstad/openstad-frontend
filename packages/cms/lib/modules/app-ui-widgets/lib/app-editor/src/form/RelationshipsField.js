import React, { Component } from 'react';
import SelectField from './SelectField';

class RelationshipField extends Component {
  render () {
      const resourceToSelect = this.props.resources ? this.props.resources.find(resource => resource.name === this.props.resourceName) : [];

      console.log('resourceToSelect in RelationshipField', resourceToSelect);

      const resourceOptions = resourceToSelect && resourceToSelect.items ? resourceToSelect.items.map((resourceItem) => {
          return {
              value: resourceItem.id,
              // we assume title if no labelfield is defined
              label: resourceToSelect.labelField ? resourceItem[resourceToSelect.labelField] : resourceItem.title
          }
      }) : [];

      console.log('resourceOptions in RelationshipField', resourceOptions);

      return <SelectField
        {...this.props}
        options={resourceOptions}
      />
  }
}

export default RelationshipField;
