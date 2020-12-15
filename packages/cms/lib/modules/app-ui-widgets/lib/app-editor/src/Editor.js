import React, { Component, useLocation } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import scriptLoader from 'react-async-script-loader';

import axios from 'axios';

import StepForm from './StepForm';
import TourApp from './frontend/components/tour/TourApp';
import AppSettingsForm from './editor-ui/AppSettingsForm';
import AppPreviewer from './editor-ui/layout/AppPreviewer';
import Sidebar from './editor-ui/Sidebar';
import {Loader, Modal} from'./editor-ui/elements';
import UI from'./editor-ui/UI';


// Our app
class Editor extends Component {

  constructor(props) {
    super(props);

    console.log('propsprops', props)

    this.state = {
      activeResource: null,
      resources: props.resources,
      appResource:  props.appResource,
      app: true,
      lineCoords: false,
    };
  }

  componentDidMount() {
  //  this.fetchApp();

    window.addEventListener("hashchange", this.handleHashChange.bind(this), false);
    this.handleHashChange();
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange.bind(this), false);
  }

  /**
   * @todo: only fetchroutes after step update, maybe callbacks to specific routes?
   * @return {[type]} [description]
   */
  fetchRoutes() {
    const coordinates =  this.state.resourceItems ? this.state.resourceItems.filter(resourceItem => resourceItem.data && resourceItem.data.position).map(function (resourceItem) {
      return resourceItem.data.position[1] + ',' + resourceItem.data.position[0];
    }).join(';') : false;

    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${encodeURIComponent(coordinates)}?alternatives=false&geometries=geojson&steps=true&annotations=distance,duration&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;

    if (coordinates) {
      axios.get(apiUrl)
        .then( (response) => {
        //  console.log('coords response', response);
          const routes = response.data.routes[0];
          const coordinates = routes.geometry.coordinates;

          const resources = this.state.resources.map((resource) => {
            if (resource.name === 'coordinates') {
              resource.items = coordinates;
            }

            return resource;
          });

          this.setState({
            resources: resources,
            duration: routes.duration
          });

          this.synchData();

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

  getDefaultResource (resourceName) {
    const defaultResource = this.state.resources.find(resource => resource.name === resourceName).default;
    return defaultResource ? defaultResource : {};
  }

  newResource(resourceName) {
    const newResource = this.getDefaultResource(resourceName);
    const resourceItems = this.getResourceItems(resourceName);

    var lastResource = [resourceItems.length - 1];
    var lastResourceId = lastResource.id;

    // increment ID and add to resourceItems
    newResource.id = lastResourceId + 1;

    resourceItems.push(newResource);

    const resources = this.state.resources.map(resource => {
      if (resourceName.name === resourceName) {
        resource.items = resourceItems;
      }

      return resource;
    })

    this.setState({
      resources: resources,
      activeResource: newResource,
      activeResourceName: resourceName,
      displaySettingsModal: false
    })
  }

  updateResource(resourceName, updateResource) {
    var activeResource = this.state.activeResource;
    var resourceItems = this.getResourceItems(resourceName);

    var resources = this.state.resources.map(function(resource) {
      if (resourceName === resource.name) {

        // update activeResource so changes are cascaded
        if (this.state.activeResourceName === resource.name && activeResource && activeResource.id === updateResource.id) {
          activeResource = updateResource;
        }

        //add
        resource.items = resource.items.map(function (resourceItem) {
          return updateResource.id === resourceItem.id ? updateResource : resourceItem;
        });
      }

      return resource;
    });

    this.setState({
      resources: resources,
      activeResource: activeResource
    });

    // might not be necessary after every
    this.fetchRoutes();

    this.synchData();
  }

  fetchApp () {
    axios.get(`/api/tour/${this.props.appId}`)
      .then( (response) => {
        const appResource =  response.data;

        this.setState({
          app: appResource,
          resources: appResource.revisions[appResource.revisions.length -1].resources
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
      resources: this.state.resources
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

  getResourceItems (name) {
    const resource = this.state.resources.filter(function(resource){ return resource.name === name; });
    return resource.items ? resource.items : [];
  }

  render() {
    if (!this.state.app) {
      return <Loader />
    }

    console.log('---- this.state.resources', this.state.resources)

    return (
      <UI
        sidebar={
          <Sidebar
            resources={this.state.resources.filter((resource) => this.props.editableResources && this.props.editableResources.includes(resource.name))}
            activeResource={this.state.activeResource}
            edit={(resourceName, resource) => {
              this.setState({
                activeResource: resource,
                activeResourceName: resourceName
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
                coordinates={this.getResourceItems('coorrdinates')}
                steps={this.getResourceItems('step')}
              />
            </AppPreviewer>
          </div>
        }
        rightPanel={
          this.state.activeResource ?
            <StepForm
              resource={this.state.activeResource}
              resourceName={this.state.activeResourceName}
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

export default Editor;;
