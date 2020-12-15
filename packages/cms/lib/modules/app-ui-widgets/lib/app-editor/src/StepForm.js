import React, { Component, useLocation } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { FilePond, File, registerPlugin } from 'react-filepond'
import Section from './editor-ui/layout/Section';
import { ReactMic } from '@cleandersonlobo/react-mic';

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';


registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFilePoster, FilePondPluginFileValidateType)
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

  getZoomLevel() {
    return this.map && this.map.leafletElement ? this.map.leafletElement.getZoom() : 12;
  }

  render() {
    var currentPos = this.props.lat &&  this.props.lng ? [this.props.lat, this.props.lng] : false;

    console.log('currentPos', currentPos)
    return (
      <Map
        center={currentPos}
        ref={(ref) => { this.map = ref; }}
        zoom={this.getZoomLevel()}
        style={{ width: '100%', height: '250px'}}
        onClick={this.handleClick.bind(this)}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=BqThJi6v35FQeB3orVDl"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {currentPos && <Marker position={currentPos} />}
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
        console.log('response', response);
          if (request.status === 200) {
             console.log('successful', response);
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

class ImageUploadField extends Component {
    constructor(props) {
      super(props);

      this.state = {
        images: []
      };
    }

    handleInit() {
      const currentImages = this.props.images ? this.props.images.map(function (image) {
        return {
          source: {url: image},
          options: {
            type: "local",
            file: {
                name: image,
           //		 size: 3001025,
             //	 type: 'image/png'
           },
            metadata: {
              poster: image,
            }
          },
        }
      }) : false;

      this.setState({
        images: currentImages
      })
    }

    updateImages(images, newImage) {
      if (images) {
      images = images
        .filter(function (fileItem) {
          return fileItem.serverId;
        })
        .map(function (fileItem) {
          console.log('fileItem', fileItem)
          const file = fileItem.file;
          const url = fileItem.serverId && fileItem.serverId.url ? fileItem.serverId.url : fileItem.serverId;

          console.log('fileItem.id', url)
          return url;
        });

        if (newImage) {
          images = [newImage].concat(images);
        }

        this.props.update(images);
      }
    }

    render () {
      console.log('this.state.images', this.state.images);

      return (
        <div>
          <FilePond
            ref={ref => (this.pond = ref)}
            onupdatefiles={fileItems => {
              // Set currently active file objects to this.state
              this.setState({
                images: fileItems.map(fileItem => fileItem.file)
              });
            }}
            files={this.state.images}
            acceptedFileTypes={['image/png', 'image/jpeg']}
            allowMultiple={true}
            allowReorder={true}
            maxFiles={10}
            oninit={() => this.handleInit()}
            server={{
              process: {
                url: '/image',
                onload: (response) => { // Once response is received, pushed new value to Final Form value variable, and populate through the onChange handler.
                  const file = JSON.parse(response);
                  this.updateImages(this.pond.getFiles(), file);
                  return JSON.parse(response).url;
                },
                onerror: (response) => {
                  return false;
                }
              }
            }}
            onremovefile={(error, file) => {
              this.updateImages(this.pond.getFiles());
            }}
            onreorderfiles={(files, origin, target) => {
              this.updateImages(this.pond.getFiles());
            }}
            maxTotalFileSize="10MB"
            imagePreviewMinHeight={22}
            imagePreviewMaxHeight={100}
            name="image"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
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

class StepForm extends Component {
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
      <div>{this.props.resource ?
        <div key={this.props.resource.data.id}>
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
              images={this.props.resource.data.images}
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

export default StepForm;
