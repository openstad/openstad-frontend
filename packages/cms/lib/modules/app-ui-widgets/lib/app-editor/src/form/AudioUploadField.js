import React, { Component } from 'react';
import { ReactMic } from '@cleandersonlobo/react-mic';

function AudioUploadField (props) {
  return (
    <div>
      <FilePond
        allowMultiple={true}
        acceptedFileTypes={['audio/mpeg', 'audio/mp3']}
        maxFiles={1}
        name='file'
        maxTotalFileSize="10MB"
        imagePreviewMinHeight={22}
        imagePreviewMaxHeight={100}
        server={{
          process: {
            url: '/file',
            onload: (response) => { // Once response is received, pushed new value to Final Form value variable, and populate through the onChange handler.
              const file = JSON.parse(response);
              props.update(file.url);
              return JSON.parse(response).url;
            },
            onerror: (response) => {
              return false;
            }
          }
        }}
        name="file"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  )
}

class AudioFormField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: null
    };
  }

  render() {
    return (
      <div>
        {this.props.audio
          ?
          <div className="audio-display flex justify-content">
            <small>
              <em>
                recording.mp3
                {/*this.props.audio.file*/}
              </em>
            </small>
            <a href="#" className="ui-button" onClick={() => {
              this.props.update(null);
            }}> x </a>
          </div>
          :
          <div>{!this.state.action && <div class="flex justify-content">
            <a href="#" className="ui-button" onClick={() => {
              this.setState({
                action: 'upload'
              })
            }}>
              Upload audio
            </a>
            <small>
              or
            </small>
            <a href="#" className="ui-button"  onClick={() => {
              this.setState({
                action: 'record'
              })
            }}>
              Record audio
            </a>
          </div>}</div>
        }
        {!this.props.audio && this.state.action &&
          <div style={{textAlign: 'right'}}>
            <a href="#" className="ui-button inline-block" onClick={() => {
              this.setState({
                action: null
              })
            }}> x </a>
          </div>
        }
        {!this.props.audio && this.state.action && this.state.action === 'record' &&
          <AudioRecordField
            update={(file) => {
              this.props.update({
                file: file
              });

              this.setState({
                action: null
              })
            }}
          />
        }
        {!this.props.audio && this.state.action && this.state.action === 'upload' &&
          <AudioUploadField
            update={(file) => {
              this.props.update({
                file: file
              });

              this.setState({
                action: null
              })
            }}
          />
        }
      </div>
    )
  }
}

export default AudioFormField;
