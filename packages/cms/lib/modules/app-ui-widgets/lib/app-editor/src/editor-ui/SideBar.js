import React, {Component, useLocation} from 'react';
import Section from './layout/Section';
import ListItem from './layout/ListItem';
import {makeCamelCasePretty} from '../utils';
import {ReactSortable} from "react-sortablejs";

const saveOrder = () => {

}

class DropDown extends component {
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

    render () {
        return (
            <div className={this.props.className}>
                {this.props.toggle}
                <
            </div>
        )
    }
}

class Sidebar extends component {
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
    render () {
        const props = this.props;

        return (
            <>
                <Section title="General">
                    <ListItem active={false}>
                        <a className="list-link" href="#settings">
                            Settings
                        </a>
                    </ListItem>
                </Section>
                {props.resources.map((resource, i) => {
                    let resourceItems = [];

                    if (resource.items) {
                        resourceItems = resource.items;
                    } else {
                        // fetch with use effect or maybe somwhere else
                    }

                    return (
                        <Section title={makeCamelCasePretty(resource.name)} key={i}>
                            <ReactSortable
                                list={resourceItems}
                                setList={(newResourceItems) => {
                                    props.updateResources(resource.name, newResourceItems)
                                }}
                            >
                                {resourceItems.map((resourceItem) => {
                                    var active = props.activeResource && resourceItem.id === props.activeResource.id && resource.name === props.activeResourceName;
                                    var linkClassName = active ? "list-link active" : "list-link";
                                    var moreLinkClassName = active ? "more-link active" : "more-link";

                                    return (
                                        <ListItem active={active}>
                                            <a className={linkClassName} onClick={() => {
                                                props.edit(resource.name, resourceItem)
                                            }} href="#">
                                                {resourceItem.title}
                                            </a>

                                            <DropDown
                                                toggle={<img src="/more.svg"/>}
                                            >
                                                <a onClick={() => {
                                                    this.props.removeResource(resource.name, resource.id)
                                                }}>
                                                    Delete
                                                </a>
                                            </DropDown>
                                        </ListItem>
                                    )
                                })}
                            </ReactSortable>
                            <div style={{textAlign: 'right'}}>
                                <a href="#" className="plus-icon" onClick={() => {
                                    props.new(resource.name)
                                }}> +</a>
                            </div>
                        </Section>
                    )
                })}
            </>
        )
    }
}

export default Sidebar;
