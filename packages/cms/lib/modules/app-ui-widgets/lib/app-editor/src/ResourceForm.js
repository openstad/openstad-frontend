import React, { Component, useLocation } from 'react';
const { SchemaForm } = require('react-schema-form');

class ResourceForm extends Component {
  render() {
    return <form>
      <FormFieldManager />
    </form>
  }
}

export default ResourceForm;
