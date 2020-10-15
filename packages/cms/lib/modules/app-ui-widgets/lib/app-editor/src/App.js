import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* Layout elements */
import LeftPanel from './Layout/LeftPanel.js';
import TopPanel from './Layout/TopPanel.js';
import MiddlePanel from './Layout/MiddlePanel.js';
import RightPanel from './Layout/RightPanel.js';
import ListItem from './Layout/ListItem.js';
import AppPreviewer from './Layout/AppPreviewer.js';

import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';


import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const position = [52.370216, 4.895168]


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function TourMap(props) {

  return (<Map center={position} zoom={17} style={{ width: '100%', height: '500px'}}>
    <TileLayer
      url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=BqThJi6v35FQeB3orVDl"
      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
    {props.steps.map(function(step) {

      return (
        <Marker position={step.position}>
          <Popup>{}.<br />Easily customizable.</Popup>
        </Marker>
      )
    })}

  </Map>
)
}

function TourList () {
  return (<div>

  </div>)
}

function TourAudioPlayer () {
  return (<div className="bottom-bar"><AudioPlayer
    autoPlay={false}
    src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    onPlay={e => console.log("onPlay")}
    // other props here
  /></div>)
}

function TourDetailView () {
  return (<div>

  </div>)
}


const listItems = [
  {
    type: 'step',
    data: {
      id: 1,
      title: 'Step 1',
      position: [52.370216, 4.895168],
    }
  },
  {
    type: 'step',
    data: {
      id: 2,
      title: 'Step 2',
      position: [52.360506, 4.908971],
    }
  },
];

const blancResource =   {
    type: 'step',
    data: {
      title: 'New...',
      position: [52.360506, 4.908971],
    }
  };

function UI (props) {
  return (
    <div className="App">
      <TopPanel>
        <a href="#"> My Apps </a>
      </TopPanel>
      <LeftPanel>
        {props.sidebar}
      </LeftPanel>
      <MiddlePanel>
        {props.main}
      </MiddlePanel>
      <RightPanel open={!!props.rightPanel}>
        <button onClick={props.rightPanelClose}> x </button>
        {props.rightPanel ? props.rightPanel : <div />}
      </RightPanel>
  </div>
  )
}


class Tour extends Component {
  render() {
    return (
      <div>
        <TourMap steps={this.props.steps} />

        <TourAudioPlayer />
        <TourList />
        <TourDetailView />
      </div>
    )
  }
}

class LocationPicker extends Component {
  handleClick(e){
    this.props.onPositionChange(e.latlng.lat, e.latlng.lng);
  }

  render() {
    var currentPos = this.props.lat &&  this.props.lng ? [this.props.lat, this.props.lng] : false;

    console.log('currentPos', currentPos)
    return (
      <Map center={currentPos} zoom={17} style={{ width: '100%', height: '250px'}} onClick={this.handleClick.bind(this)}>
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

function Sidebar (props) {
  return <div>

    {props.resourceItems.map(function(resourceItem) {
        return(
          <ListItem>
            {resourceItem.data.title}
              <button onClick={() => {
                props.delete(resourceItem)
              }}>
                move
              </button>
              <button onClick={() => {
                props.delete(resourceItem)
              }}>
                delete
              </button>
              <button onClick={() => {
                props.edit(resourceItem)
              }}>
                edit
              </button>
          </ListItem>
        )
      })}
      <button onClick={props.new}> + Add </button>
  </div>
}

function ResourceForm (props) {
  console.log('props.resource', props.resource)
  return (
    <div>{props.resource ?
      <div>
        <div className="form-group">
          <label> Location </label>
          <LocationPicker
            lat={props.resource.data.position && props.resource.data.position[0] ? props.resource.data.position[0] : null}
            lng={props.resource.data.position && props.resource.data.position[1] ? props.resource.data.position[1] : null}
            onPositionChange={function (lat, lng) {
              props.updateResource({
                ...props.resource,
                data: {
                  ...props.resource.data,
                  position: [lat, lng]
                }
              })
            }}
          />
        </div>
        <div className="form-group">
          <label> Name </label>
          <input type="" name="name"/>
        </div>
        <div className="form-group">
          <label> Description </label>
          <input type="" name="name"/>
        </div>
        <div className="form-group">
          <label> Audio </label>
          <input type="" name="name"/>
        </div>
        <div className="form-group">
          <label> Images </label>
          <input type="" name="name"/>
        </div>
        <div className="form-group">
          <label> Videos </label>
          <input type="" name="name"/>
        </div>
      </div>
      :
      <div />}
    </div>
  )
}

// Our app
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeResource: null,
      resourceItems: listItems
    };
  }

  newResource() {
    var newResource = JSON.parse(JSON.stringify(blancResource));
    var lastResource = this.state.resourceItems[this.state.resourceItems.length - 1];
    console.log('lastResource', lastResource)

    var lastResourceId = lastResource.data.id;

    console.log('lastResourceId', lastResourceId)

    newResource.data.id = lastResourceId + 1;
    console.log('newResource', newResource)

    this.state.resourceItems.push(Object.assign({}, newResource));
    console.log('this.state.resourceItems', this.state.resourceItems)

    this.setState({
      resourceItems: this.state.resourceItems,
      activeResource: newResource
    })
  }

  updateResource(updateResource) {
    var activeResource = this.state.activeResource;
    var resourceItems = this.state.resourceItems.map(function(resource) {
      if (resource.data.id === updateResource.data.id) {
        resource = updateResource;
      }

      if (activeResource && activeResource.data.id === resource.data.id) {
        activeResource = resource;
      }

      return resource;
    });

    this.setState({
      resourceItems: resourceItems,
      activeResource: activeResource
    })
  }

  deleteResource(resource) {
    var activeResource = this.state.activeResource;

    for (var i = 0; i < this.state.resourceItems.length; i++) {
      var resourceItem = this.state.resourceItems[i];
       if (resourceItem.data.id === resource.data.id) {
        this.state.resourceItems.splice(i, 1);
        i--;
        if (activeResource && activeResource.data.id === resource.data.id) {
          activeResource = null;
        }
       }
    }

    this.setState({
      resourceItems: this.state.resourceItems,
      activeResource: activeResource
    })
  }

  render() {
    return (
      <UI
        sidebar={
          <Sidebar
            resourceItems={this.state.resourceItems}
            edit={(resource) => {
              this.setState({
                activeResource: resource
              })
            }}
            new={this.newResource.bind(this)}
            delete={this.deleteResource.bind(this)}
          />
        }
        main={
          <AppPreviewer>
            <Tour
              steps={
                this.state.resourceItems
                  .filter(function(resource){ return resource.type === 'step'; })
                  .map(function(step){ return step.data; } )
              }
            />
          </AppPreviewer>
        }
        rightPanel={
          this.state.activeResource ?
            <ResourceForm
              resource={this.state.activeResource}
              updateResource={this.updateResource.bind(this)}
            /> : false
        }
        rightPanelClose={() => {
          this.setState({
            activeResource: null
          })
        }}
      />
    );
  }
}


export default App;
