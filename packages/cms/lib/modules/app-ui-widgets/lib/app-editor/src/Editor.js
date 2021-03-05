import React, {Component} from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import scriptLoader from 'react-async-script-loader';

import axios from 'axios';

import AppSettingsForm from './editor-ui/AppSettingsForm';
import AppPreviewer from './editor-ui/layout/AppPreviewer';
import Sidebar from './editor-ui/SideBar';
import {ComponentEditMenu, Loader, Modal} from './editor-ui/elements';
import UI from './editor-ui/UI';
import GenericApp from "./frontend/GenericApp";
import appResource from "./defaults";
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

//wrap app so it doesn't get updated on every state change of editor
const AppWrapper = (props) => {
    return <GenericApp
        {...props}
    />
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
            appResource: props.appResource,
            loading: true,
            lineCoords: false,
            crudCount: 0
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

        let stepCoordinates = resourceItems ? resourceItems.map((resourceItem) => {
            return resourceItem.position[1] + ',' + resourceItem.position[0];
        }) : '';

        if (stepCoordinates) {
            const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${encodeURIComponent(stepCoordinates.join(';'))}?alternatives=false&geometries=geojson&steps=true&annotations=distance,duration&overview=full&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;

            axios.get(apiUrl)
                .then((response) => {

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

            if (resource.name === resourceName) {
                resource.items = newResourceItems;
            }

            return resource;
        });


        this.setState({
            resources: resources,
        });
    }

    removeResourceItem(resourceName, resourceItemId) {
        if (window.confirm('Sure ?')) {
            const resources = this.state.resources.map((resource) => {

                if (resource.name === resourceName) {
                    resource.items = resource.items.filter(item => item.id !== resourceItemId);
                }

                return resource;
            });


            this.setState({
                resources: resources,
            });
        }
    }

    handleHashChange() {
        var location = window.location;
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

    getDefaultResource(resourceName) {
        const resourceSchema = resourceSchemas[resourceName];
        const defaultValues = resourceSchema && resourceSchema.defaultValues ? resourceSchema.defaultValues : {};

        // make sure it;s not a reference
        return {
            ...defaultValues
        }
    }

    newResource(resourceName) {
        const newResource = this.getDefaultResource(resourceName);
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
        });

        console.log('new me me me');


        this.synchData();

    }

    updateResources(resourceName, newResourcesItems) {
        console.log('update all of me me');

        const resources = this.state.resources.map((resource) => {
            if (resourceName === resource.name) {//add
                resource.items = newResourcesItems;
            }

            return resource;
        });

        this.setState({
            resources: resources,
        });

        this.synchData();
    }

    updateResource(resourceName, updateResource) {

        console.log('update me');

        let activeResource = this.state.activeResource;

        const resources = this.state.resources.map((resource) => {
            if (resourceName === resource.name) {

                // update activeResource so changes are cascaded
                if (this.state.activeResourceName === resource.name && activeResource && activeResource.id === updateResource.id) {
                    activeResource = updateResource;
                }

                //add
                resource.items = resource.items.map((resourceItem) => {
                    return updateResource.id === resourceItem.id ? {
                        ...updateResource,
                        updatedAtTimestamp: new Date().getTime()
                    } : resourceItem;
                });
            }


            return resource;
        });

        this.setState({
            resources: resources,
            activeResource: activeResource
        });

        if (resourceName === 'step') {
            this.fetchRoutes();
        }

        this.synchData();

    }

    fetchApp() {

        axios.get(`/api/tour/${this.props.appId}`)
            .then((response) => {

                const appResource = response.data;
                const resources = appResource.revisions[appResource.revisions.length - 1].resources;

                this.setState({
                    loading: false,
                    app: appResource,
                    resources: this.props.defaultResources.map((defaultResource) => {
                        const resource = resources.find(dataResource => dataResource.name === defaultResource.name)
                        return resource ? resource : defaultResource;
                    })
                });

                //this.fetchRoutes();
            })
            .catch(function (error) {
                console.log('Error', error);
            });
    }

    synchData() {
        const app = this.state.appResource;

        app.revisions = app.revisions ? app.revisions : [];

        app.revisions.push({
            title: 'App demo 1',
            settings: {},
            resources: this.state.resources
        })

        console.log('sync')

        this.setState({
            crudCount: this.state.crudCount + 1
        })

        axios.put(`/api/tour/${this.props.appId}`, app)
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

    getResourceItems(resourceName) {
        const resource = this.state.resources.find(function (resource) {
            return resource.name === resourceName;
        });
        return resource && resource.items ? resource.items : [];
    }

    getStyling() {

    }

    render() {
        if (this.state.loading) {
            return <Loader/>
        }

        return (
            <UI
                sidebar={
                    <Sidebar
                        singleResources={this.state.resources.filter((resource) => this.props.singleResources && this.props.singleResources.includes(resource.name))}
                        resources={this.state.resources.filter((resource) => this.props.editableResources && this.props.editableResources.includes(resource.name))}
                        activeResource={this.state.activeResource}
                        activeResourceName={this.state.activeResourceName}
                        updateResources={this.updateResources.bind(this)}
                        removeResourceItem={this.removeResourceItem.bind(this)}
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
                            <AppWrapper
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
                                crudCount={this.state.crudCount}
                            />

                        </AppPreviewer>
                    </div>
                }
                rightPanel={
                    this.state.activeResource ?
                        <ResourceForm
                            activeResource={this.state.activeResource}
                            resourceName={this.state.activeResourceName}
                            resources={this.state.resources}
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
