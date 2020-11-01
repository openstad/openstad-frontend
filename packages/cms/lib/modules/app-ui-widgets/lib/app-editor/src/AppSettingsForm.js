import React, { Component } from 'react';
import LocationSearchInput from './LocationSearchInput.js';
import Section from './Layout/Section.js';


class AppSettingsForm extends Component {
  render() {
    var update = (resource, key, value) => {
      this.props.updateResource({
        ...this.props.resource,
        data: {
          ...this.props.resource.data,
          [key]:value
        }
      })
    }

  //  const [files, setFiles] = useState([])

    var files = [];
    var setFiles = () => {};
    return (
        <div>
          <Section title="Title">
            <input
              type=""
              name="title"
              defaultValue=""
              onChange={(event) => {
                update(this.props.resource, 'title', event.currentTarget.value)
              }}
            />
          </Section>

          <Section title="Location">
            Where is the tour located (or starts)?
            <LocationSearchInput />
          </Section>

          <div style={{display: "flex", justifyContent: 'flex-end', padding: '20px 0'}}>
            <button class="ui-button" style={{marginRight: '5px'}}>
              Cancel
            </button>
            <button class="ui-button ui-button--primary" onclick={() => {

            }}>
              Ok
            </button>
          </div>
        </div>
    )
  }
}

export default AppSettingsForm;
