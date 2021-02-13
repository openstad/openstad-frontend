import React, { Component } from 'react';
import { FilePond, File, registerPlugin } from 'react-filepond'
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import {ReactMic} from "@cleandersonlobo/react-mic";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFilePoster, FilePondPluginFileValidateType)



var toMMSS = function (string) {
  var sec_num = parseInt(string, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return minutes+':'+seconds;
}



export class AudioRecordField extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;

    this.state = {
      record: false,
      recordingTime: 0
    }
  }

  toggleRecording = () => {
    var recording = !this.state.record;

    if (recording) {
      this.startTimer();
    } else {
      this.stopTimer()
    }

    this.setState({
      record: recording
    });
  }

  startTimer () {
    this.timer = setInterval(() => {
      this.setState({
        recordingTime: this.state.recordingTime + 1
      });
    }, 1000)
  }

  stopTimer () {

    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onData(recordedBlob) {
    //  console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    this.setState({
      recordedBlob: recordedBlob
    })
  }

  resetRecording () {
    this.setState({
      recordedBlob: null,
      recordingTime: 0
    })
  }

  saveRecording () {
    // Turns out getAsFile will return a blob, not a file
    var form = new FormData();
    var request = new XMLHttpRequest();
    var blob =  this.state.recordedBlob.blob;

    form.append("file", blob, 'recording.mp3');

    request.open("POST", "/file", true );

    request.send(form);

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        var response = JSON.parse(request.responseText);
        if (request.status === 200) {
          this.props.update(response.url);
        } else {
          console.log('failed');
        }
      }
    }
  }

  render() {
    return (
        <div  style={{textAlign: 'center'}}>
          <div style={{display: 'none'}}>

            <ReactMic
                record={this.state.record}
                visualSetting="frequencyBars"
                className="sound-wave"
                onStop={this.onStop.bind(this)}
                onData={this.onData.bind(this)}
                strokeColor="#000000"
                width={120}
                height={50}
                backgroundColor="#FF4081"
            />
          </div>
          <div style={{textAlign: 'center'}}>
            {this.state.recordedBlob &&
            <a href="javascript: false" onClick={this.resetRecording.bind(this)}>
              <img src="/x.svg" style={{
                width: '15px',
                padding: '7px',
                opacity: '0.6'
              }} />
            </a>
            }
            <button
                className={this.state.record ? 'recorder Rec' : 'recorder notRec'}
                onClick={this.toggleRecording.bind(this)} type="button">
            </button>
            {this.state.recordedBlob &&
            <a href="javascript: false" onClick={this.saveRecording.bind(this)}>
              <img src="/check.svg" style={{
                width: '15px',
                padding: '7px',
                opacity: '0.6'
              }}/>
            </a>
            }
          </div>
          <div className="duration">{toMMSS(this.state.recordingTime)}</div>
        </div>
    );
  }
}

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
