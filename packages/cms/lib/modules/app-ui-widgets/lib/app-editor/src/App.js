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

    console.log('props', props)

    this.state = {
      activeResource: null,
      resourceItems: props.resourceItems,
      appResource:  props.appResource,
    };
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.handleHashChange.bind(this), false);
    this.handleHashChange();
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange.bind(this), false);
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

  synchData() {
    var app = this.state.appResource;

    app.revisions = app.revisions ? app.revisions : [];

    app.revisions.push({
      title: 'App demo 1',
      settings: {},
      resourceItems: this.state.resourceItems,
    })

    console.log('app.revisions', app.revisions)

    axios.post('/api/tour', app)
      .then(function (response) {
        console.log('success response', response);
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

export default scriptLoader(['https://maps.googleapis.com/maps/api/js?libraries=places&key=' + process.env.REACT_APP_GOOGLE_MAPS_API_KEY])(App);
