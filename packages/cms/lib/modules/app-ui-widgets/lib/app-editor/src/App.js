import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* Layout elements */
import LeftPanel from './Layout/LeftPanel.js';
import TopPanel from './Layout/TopPanel.js';
import MiddlePanel from './Layout/MiddlePanel.js';
import RightPanel from './Layout/RightPanel.js';
import ListItem from './Layout/ListItem.js';

import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

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
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
  return (<div>

  </div>)
}

function TourDetailView () {
  return (<div>

  </div>)
}


const listItems = [
  {
    type: 'step',
    data: {
      title: 'Step 1',
      position: [52.370216, 4.895168],
    }
  },
  {
    type: 'step',
    data: {
      title: 'Step 2',
      position: [52.360506, 4.908971],
    }
  },
]

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

/**
 * AppPreviewer allows for different devices views regardless of it's content
 */
function AppPreviewer (props) {
  return (
    <div className>
      <a href="#"> M </a> | <a href="#"> D </a>
      <div className="device-wrapper">
        {props.children}
      </div>
    </div>
  );
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
  constructor(props) {
    super(props);

    this.state = {
      currentPos: this.props.position
    };

    this.handleClick = this.handleClick.bind(this);
  }


  handleClick(e){
    this.setState({ currentPos: e.latlng });
  }

  render() {
    return (
      <Map center={position} zoom={17} style={{ width: '100%', height: '250px'}} onClick={this.handleClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {this.state.currentPos && <Marker position={this.state.currentPos}>
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
      <button onClick={props.edit}> + Add </button>
  </div>
}

function ResourceForm (props) {
  return (
    <div>{props.resource ?
      <div>
        <div className="form-group">
          <label> Location </label>
          <LocationPicker
            position={props.resource.data.position}
            updatePosition={function (position) {
              this.props.updateResource({
                data: {
                  ...props.resource.data,
                  position
                }
              )
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
    this.setState({
      activeResource: this.props.newResourceObject
    })
  }

  updateResource(updateResource) {
    const resourceItems = this.state.resourceItems.map(function(resource) {
      if (resource.data.id === updateResource.data.id) {
        resource = updateResource;
      }

      return updateResource;
    });


    this.setState({
      resourceItems: resourceItems
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
          />
        }
        main={
          <div>
            <Tour
              steps={
                this.state.resourceItems
                  .filter(function(resource){ return resource.type === 'step'; })
                  .map(function(step){ return step.data; } )
              }
            />
          </div>
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
