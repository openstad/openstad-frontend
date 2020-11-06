import React, { Component, useLocation } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import scriptLoader from 'react-async-script-loader';

import axios from 'axios';

/* Layout elements */
import LeftPanel from './Layout/LeftPanel.js';
import TopPanel from './Layout/TopPanel.js';
import MiddlePanel from './Layout/MiddlePanel.js';
import RightPanel from './Layout/RightPanel.js';
import ListItem from './Layout/ListItem.js';
import AppPreviewer from './Layout/AppPreviewer.js';
import Section from './Layout/Section.js';

import ResourceForm from './ResourceForm.js';
import TourApp from './TourApp.js';
import AppSettingsForm from './AppSettingsForm.js';

const listItems = [
  {
    type: 'step',
    data: {
      id: 1,
      title: 'Step 1',
      description: 'Lorem ipsum....',
      position: [52.370216, 4.895168],
      images: ['https://image-server2.openstadsdeel.nl/image/9c9554218311abb0d1797945e575db97/:/rs=w:1400,h:500;cp=w:1400,h:500'],
      audio: {
        filename: 'test.mp3'
      }
    }
  },
  {
    type: 'step',
    data: {
      id: 2,
      title: 'Step 2',
      description: 'Lorem ipsum....',
      position: [52.360506, 4.908971],
      images: ['https://image-server2.openstadsdeel.nl/image/9c9554218311abb0d1797945e575db97/:/rs=w:1400,h:500;cp=w:1400,h:500']
    }
  },
];

const blancResource = {
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
        <a href="#" className="App-logo"> Edu Apps </a>
      </TopPanel>
      <div className="ContentPlane">
        <LeftPanel>
          {props.sidebar}
        </LeftPanel>
        <MiddlePanel>
          {props.main}
        </MiddlePanel>
        <RightPanel open={!!props.rightPanel}>

          {props.rightPanel ?
            <div>
            <Section style={{textAlign: 'right'}} collapsible={false}>
              <a href="#" style={{fontSize: '16px', color: '#8f8f8f'}} className="plus-icon" onClick={props.rightPanelClose}> ✕ </a>
            </Section>
            {props.rightPanel}
            </div> :

          <div />}
        </RightPanel>
      </div>

  </div>
  )
}

function Sidebar (props) {
  return (
    <>
      <Section title="General">
      <ListItem active={false} >
        <a className="list-link" href="#settings">
          Settings
        </a>
      </ListItem>
      </Section>
      <Section title="Steps">
        {props.resourceItems.map(function(resourceItem) {
          var active = props.activeResource && resourceItem.data.id === props.activeResource.data.id ;
          var linkClassName = active ? "list-link active" : "list-link";
          return(
            <ListItem active={active}>
              <a className={linkClassName} onClick={() => {
                props.edit(resourceItem)
              }} href="#">
                {resourceItem.data.title}
              </a>
            </ListItem>
          )
        })}
        <div style={{textAlign: 'right'}}>
        <a href="#" className="plus-icon" onClick={props.new}> +</a>
        </div>
      </Section>
    </>
  )
}


// Our app
class App extends Component {

  constructor(props) {
    super(props);


    this.state = {
      activeResource: null,
      resourceItems: props.resourceItems,
      appResource:  props.appResource,
      app: false,
      lineCoords: false,
    };
  }

  componentDidMount() {
    this.fetchApp();

    window.addEventListener("hashchange", this.handleHashChange.bind(this), false);
    this.handleHashChange();
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange.bind(this), false);
  }

  fetchRoutes() {
    const coordinates =  this.state.resourceItems ? this.state.resourceItems.filter(resourceItem => resourceItem.data && resourceItem.data.position).map(function (resourceItem) {
      return resourceItem.data.position[1] + ',' + resourceItem.data.position[0];
    }).join(';') : false;

    console.log(coordinates);

    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${encodeURIComponent(coordinates)}?alternatives=false&geometries=geojson&steps=true&annotations=distance,duration&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;



    if (coordinates) {

      console.log('apiUrl', apiUrl);

      axios.get(apiUrl)
        .then( (response) => {
        //  console.log('coords response', response);
          const routes = response.data.routes[0];
          console.log('coords routes', routes);
          const coordinates = routes.geometry.coordinates;
          console.log('coords routes', routes.geometry.coordinates);


          this.setState({
            coordinates: coordinates,
            duration: routes.duration
          })
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  handleHashChange() {
    var location =  window.location;
    var hash = location.hash;

    this.setState({
      displaySettingsModal: false
    });


    if (hash.startsWith('#settings')) {
      this.setState({
        displaySettingsModal: true
      });
    }

  }

  newResource() {
    var newResource = JSON.parse(JSON.stringify(blancResource));
    var lastResource = this.state.resourceItems[this.state.resourceItems.length - 1];
    var lastResourceId = lastResource.data.id;

    newResource.data.id = lastResourceId + 1;

    this.state.resourceItems.push(newResource);

    this.setState({
      resourceItems: this.state.resourceItems,
      activeResource: newResource,
      displaySettingsModal: false

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
    });

    this.synchData()
  }

  fetchApp () {
    axios.get(`/api/tour/${this.props.appId}`)
      .then( (response) => {
        const appResource =  response.data;

        this.setState({
          app: appResource,
          resourceItems: appResource.revisions[appResource.revisions.length -1].resourceItems
        });


        this.fetchRoutes();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  synchData() {
    var app = this.state.appResource;

    app.revisions = app.revisions ? app.revisions : [];

    app.revisions.push({
      title: 'App demo 1',
      settings: {},
      resourceItems: this.state.resourceItems,
    })

    axios.put(`/api/tour/${app.id}`, app)
      .then(function (response) {
        this.setState({
          app: response
        })
      })
      .catch(function (error) {
        console.log(error);
      });

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
    console.log(' process.env.GOOGLE_MAPS_API_KEY',  process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    console.log(' process.env.GOOGLE_MAPS_API_KEY',  process.env);

    if (!this.state.app) {
      return <Loader />
    }

    return (
      <UI
        sidebar={
          <Sidebar
            resourceItems={this.state.resourceItems}
            activeResource={this.state.activeResource}
            edit={(resource) => {
              this.setState({
                activeResource: resource
              });
            }}
            new={this.newResource.bind(this)}
            delete={this.deleteResource.bind(this)}
          />
        }
        main={
          <div>
            {this.state.displaySettingsModal &&
              <Modal show={true}>
              <AppSettingsForm
                resource={this.state.appResource}
              />
              </Modal>
            }
            <AppPreviewer>
              <TourApp
                coordinates={this.state.coordinates}
                steps={
                  this.state.resourceItems
                    .filter(function(resource){ return resource.type === 'step'; })
                    .map(function(step){ return step.data; } )
                }
              />
          </AppPreviewer>
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

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <a class="modal-close" href="#">✕</a>
      </section>
    </div>
  );
};

const Loader = function () {
  return <div style={{position: 'fixed', top: '50%', width: '100%', textAlign: 'center'  }}> Loading... </div>
}

export default scriptLoader(['https://maps.googleapis.com/maps/api/js?libraries=places&key=' + process.env.REACT_APP_GOOGLE_MAPS_API_KEY])(App);
