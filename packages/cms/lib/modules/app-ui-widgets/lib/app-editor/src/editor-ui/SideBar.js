import React, { Component, useLocation } from 'react';
import Section from './layout/Section';
import ListItem from './layout/ListItem';
import {makeCamelCasePretty} from '../utils';


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
      {props.resources.map((resource, i) => {
        let resourceItems = [];

        if (resource.items) {
          resourceItems = resource.items;
        } else  {
          // fetch with use effect or maybe somwhere else
        }

        return (
          <Section title={makeCamelCasePretty(resource.name)} key={i}>
            {resourceItems.map(function(resourceItem) {
              var active = props.activeResource && resourceItem.id === props.activeResource.id && resource.name === props.activeResourceName;
              var linkClassName = active ? "list-link active" : "list-link";

              return(
                <ListItem active={active}>
                  <a className={linkClassName} onClick={() => {
                    props.edit(resource.name, resourceItem)
                  }} href="#">
                    {resourceItem.title}
                  </a>
                </ListItem>
              )
            })}
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

export default Sidebar;
