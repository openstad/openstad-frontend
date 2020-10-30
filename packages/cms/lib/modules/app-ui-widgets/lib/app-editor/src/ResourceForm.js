import React, { Component, useLocation } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { FilePond, File, registerPlugin } from 'react-filepond'
import Section from './Layout/Section.js';
import { ReactMic } from '@cleandersonlobo/react-mic';

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


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

class LocationPicker extends Component {
  handleClick(e){
    this.props.onPositionChange(e.latlng.lat, e.latlng.lng);
  }

  render() {
    var currentPos = this.props.lat &&  this.props.lng ? [this.props.lat, this.props.lng] : false;

    console.log('currentPos', currentPos)
    return (
      <Map center={currentPos} zoom={12} style={{ width: '100%', height: '250px'}} onClick={this.handleClick.bind(this)}>
        <TileLayer
          url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=BqThJi6v35FQeB3orVDl"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {currentPos && <Marker position={currentPos}>
          <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
        </Marker>}
      </Map>
    )
  }
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
    console.log('recordedBlob is: ', recordedBlob);
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

function ImageUploadField (props) {

  const defaultImages = props.images ? props.images.map(function (image) {
    return {
      source: image,
      options: {
        type: "local",
        metadata: {
          poster: image,
        }
      },
    }
  }) : [];


  return (
    <div>
      <FilePond
        onupdatefiles={(files) => {
          console.log('files updated', files)
        }}
        files={defaultImages}
        allowMultiple={true}
        maxFiles={10}
        name='image'
        maxTotalFileSize="10MB"
        imagePreviewMinHeight={22}
        imagePreviewMaxHeight={100}
        onupdatefiles={fileItems => {
          //fieldProps.input.onChange('test:image');
          console.log('fileItems', fileItems);

          if (fileItems[0]) {
            console.log('fileItems[0].file', fileItems[0].file);
          }
        }}
        server={{
          process: {
            url: process.env.IMAGE_API_URL,
            onload: (response) => { // Once response is received, pushed new value to Final Form value variable, and populate through the onChange handler.
              const file = JSON.parse(response);
              //fieldProps.input.value = JSON.parse(response);
            //  fieldProps.input.onChange( JSON.parse(response) );
              return JSON.parse(response).url;
            },
            onerror: (response) => { // If error transpires, add error to value with error message.
              //fieldProps.input.value = '';
            //  fieldProps.input.onChange('');
              return false;
            }
          }
        }}
        name="files"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>

  )
}

function AudioUploadField (props) {


  return (
    <div>
      <FilePond
        onupdatefiles={() => {
          
        }}
        allowMultiple={true}
        maxFiles={1}
        name='image'
        maxTotalFileSize="10MB"
        imagePreviewMinHeight={22}
        imagePreviewMaxHeight={100}
        onupdatefiles={fileItems => {
          //fieldProps.input.onChange('test:image');
          console.log('fileItems', fileItems);

          if (fileItems[0]) {
            console.log('fileItems[0].file', fileItems[0].file);
          }
        }}
        server={{
          process: {
            url: process.env.IMAGE_API_URL,
            onload: (response) => { // Once response is received, pushed new value to Final Form value variable, and populate through the onChange handler.
              const file = JSON.parse(response);
              //fieldProps.input.value = JSON.parse(response);
            //  fieldProps.input.onChange( JSON.parse(response) );
              return JSON.parse(response).url;
            },
            onerror: (response) => { // If error transpires, add error to value with error message.
              //fieldProps.input.value = '';
            //  fieldProps.input.onChange('');
              return false;
            }
          }
        }}
        name="files"
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
            <small><em>{this.props.audio.filename}</em></small>
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
          <AudioRecordField />
        }
        {!this.props.audio && this.state.action && this.state.action === 'upload' &&
          <AudioUploadField
          />
        }
      </div>
    )
  }
}

class ResourceForm extends Component {
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

    var handleSort = (sortedData) => {
      const url = '/api/HotelPhotos/PhotoSort';
      console.log('sortedData', sortedData);
    }

  //  const [files, setFiles] = useState([])

    var files = [];
    var setFiles = () => {};
    return (
      <div>{this.props.resource ?
        <div>
          <Section title="location">
            <LocationPicker
              lat={this.props.resource.data.position && this.props.resource.data.position[0] ? this.props.resource.data.position[0] : null}
              lng={this.props.resource.data.position && this.props.resource.data.position[1] ? this.props.resource.data.position[1] : null}
              onPositionChange={function (lat, lng) {
                this.props.updateResource({
                  ...this.props.resource,
                  data: {
                    ...this.props.resource.data,
                    position: [lat, lng]
                  }
                })
              }.bind(this)}
            />
          </Section>
          <Section title="Title">
            <input
              type=""
              name="title"
              defaultValue={this.props.resource.data.title}
              onChange={(event) => {
                update(this.props.resource, 'title', event.currentTarget.value)
              }}
            />
          </Section>
          <Section title="Description">
            <textarea
              type=""
              name="title"
              defaultValue={this.props.resource.data.description}
              onChange={(event) => {
                update(this.props.resource, 'description', event.currentTarget.value)
              }}
            />
            </Section>
          <Section title="Audio">
            <AudioFormField
              audio={this.props.resource.data.audio}
              update={(value) => {
                update(this.props.resource, 'audio', value)
              }}
            />
          </Section>
          <Section title="Images">
            <ImageUploadField
              files={files}
              update={(images) => {
                update(this.props.resource, 'images', images)
              }}
            />
            </Section>
          {/*
            <div className="form-group">
            <label> Videos </label>
            <br />

            <input type="" name="name"/>
          </div>
          */}
        </div>
        :
        <div />}
      </div>
    )
  }
}

export default ResourceForm;
