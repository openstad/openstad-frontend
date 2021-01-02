import React, { Component } from 'react';
import LocationSearchInput from './LocationSearchInput';
import Section from './layout/Section';
import LanguageSelect from  '../form/LanguageSelect';


class AppSettingsForm extends Component {
  handleSave() {
    window.location.hash = '#';
  }

  render() {
    var update = (resource, key, value) => {
      this.props.updateResource({
        ...this.props.resource,
        {
          ...this.props.resource,
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
              defaultValue={this.props.resource.title}

            />
          </Section>

          <Section title="Categories">

          </Section>

          <Section title="Duration">

          </Section>

          <Section title="Language">
            <LanguageSelect />
          </Section>

          <Section title="Start Location">
            <LocationSearchInput />
          </Section>

          <div style={{display: "flex", justifyContent: 'flex-end', padding: '20px 0'}}>
            <button class="ui-button ui-button--primary" onClick={this.handleSave.bind(this)}>
              Ok
            </button>
          </div>
        </div>
    )
  }
}

export default AppSettingsForm;
