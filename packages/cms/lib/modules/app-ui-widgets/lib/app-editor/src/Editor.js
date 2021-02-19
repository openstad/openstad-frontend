import React, { Component } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import scriptLoader from 'react-async-script-loader';

import axios from 'axios';

import AppSettingsForm from './editor-ui/AppSettingsForm';
import AppPreviewer from './editor-ui/layout/AppPreviewer';
import Sidebar from './editor-ui/SideBar';
import {ComponentEditMenu, Loader, Modal} from './editor-ui/elements';
import UI from'./editor-ui/UI';
import GenericApp from "./frontend/GenericApp";
import appResource  from "./defaults";
import ResourceForm from "./ResourceForm";
import resourceSchemas from "./config/resourceSchemas";

const preCompononent = (props) => {
  return (
      <div>
        <ComponentEditMenu {...props} />
      </div>
  )
}

const postCompononent = (props) => {
  return (
      <>

      </>
  )
}
/*
<TourApp
                coordinates={this.getResourceItems('coordinates')}
                steps={this.getResourceItems('step')}
                app={{
                  location: 'Amsterdam, Netherlands',
                  title: 'Vondelpark & Oud West Neighborhoud', //this.props.title,
                  description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',//this.props.description,
                  transportType: 'Walking',
                  duration: '1 hour',
                  language: 'English'
                }}
              />
 */

// Our app
class Editor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeResource: null,
      resources: props.resources,
      appResource:  props.appResource,
      loading: true,
      lineCoords: false,
    };

  //  this.fetchRoutes.bind(this);
  }

  componentDidMount() {
    this.fetchApp();
  //  this.fetchRoutes();

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
    const resourceItems = this.getResourceItems('step');

    let stepCoordinates = resourceItems ?  resourceItems.map((resourceItem) => {
      return resourceItem.position[1] + ',' + resourceItem.position[0];
    }) : '';

    if (stepCoordinates) {
      const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${encodeURIComponent(stepCoordinates.join(';'))}?alternatives=false&geometries=geojson&steps=true&annotations=distance,duration&overview=full&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;

      axios.get(apiUrl)
        .then( (response) => {

          const routes = response.data.routes[0];
          const coordinates = routes.geometry.coordinates;

          this.updateResourceItems('coordinates', coordinates);

          // add duration, needs to be moved to resourcs
          this.setState({
            duration: routes.duration
          });

          this.synchData();
        })
        .catch(function (error) {
          console.log('>>>>> error', error);
        });
    }
  }

  updateResourceItems(resourceName, newResourceItems) {
    const resources = this.state.resources.map((resource) => {
      console.log('resource.name', resource.name)

      if (resource.name === resourceName) {
        resource.items = newResourceItems;
      }

      return resource;
    });


    this.setState({
      resources: resources,
    });
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
    const resourceSchema = resourceSchemas[resourceName];
    return resourceSchema && resourceSchema.defaultValues ? resourceSchema.defaultValues : {};
  }

  newResource(resourceName) {
    const newResource = this.getDefaultResource(resourceName);
    console.log('newResource', newResource)
    const resourceItems = this.getResourceItems(resourceName);

    var lastResource = resourceItems[resourceItems.length - 1];
    var lastResourceId = lastResource ? lastResource.id : 1;

    // increment ID and add to resourceItems
    newResource.id = lastResourceId + 1;
    resourceItems.push(newResource);

    this.updateResourceItems(resourceName, resourceItems)

    this.setState({
      activeResource: newResource,
      activeResourceName: resourceName,
      displaySettingsModal: false
    })
  }

  updateResource(resourceName, updateResource) {

    let activeResource = this.state.activeResource;

    console.log('activeResource', activeResource)

    const resources = this.state.resources.map((resource) => {
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
        console.log('response', response);

        const appResource =  response.data;
        const resources = appResource.revisions[appResource.revisions.length -1].resources;

        this.setState({
          loading: false,
          app: appResource,
          resources: this.props.defaultResources.map((defaultResource) => {
            const resource = resources.find(dataResource => dataResource.name === defaultResource.name)
            return resource ? resource : defaultResource;
          })
        });

        this.fetchRoutes();
      })
      .catch(function (error) {
        console.log('Error', error);
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

      /*  this.setState({
          app: response
        })*/
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

  getResourceItems (resourceName) {
    const resource = this.state.resources.find(function(resource){ return resource.name === resourceName; });
    return resource && resource.items ? resource.items : [];
  }

  render() {
    if (this.state.loading) {
      return <Loader />
    }
    console.log('this.state.appResource in Editor', this.state.appResource)
    console.log('this.state.resources in Editor', this.state.resources)

    return (
      <UI
        sidebar={
          <Sidebar
            resources={this.state.resources.filter((resource) => this.props.editableResources && this.props.editableResources.includes(resource.name))}
            activeResource={this.state.activeResource}
            activeResourceName={this.state.activeResourceName}
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
              <GenericApp
                  id={this.state.appResource.id}
                  title={this.state.appResource.title}
                  styling={this.state.appResource.styling}
                  settings={this.state.appResource.settings}
                  resourcesData={this.state.resources}
                  resourceSchemas={this.props.resourceSchemas}
                  navigationSettings={this.state.appResource.navigationSettings}
                  screens={this.state.appResource.screens}
                  user={this.props.user}
                  preCompononent={preCompononent}
                  postCompononent={postCompononent}
                  isSignedIn={true}
              />
            </AppPreviewer>
          </div>
        }
        rightPanel={
          this.state.activeResource ?
            <ResourceForm
              activeResource={this.state.activeResource}
              resourceName={this.state.activeResourceName}
              update={(key, value) => {
                this.updateResource(
                    this.state.activeResourceName,
                    {
                      ...this.state.activeResource,
                      [key]: value
                    }
                )
              }}
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

export default scriptLoader(['https://maps.googleapis.com/maps/api/js?libraries=places&key=' + process.env.REACT_APP_GOOGLE_MAPS_API_KEY])(Editor);
