import React, { Component, useLocation } from 'react';
import Section from './layout/Section';
import ListItem from './layout/ListItem';

function OldSidebar (props) {
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
      {props.resources.map((resource) => {
        let resourceItems = [];

        if (resource.items) {
          resourceItems = resource.items;
        } else  {
          // fetch with use effect or maybe somwhere else
        }

        return (
          <Section title={resource.name}>
            {resourceItems.map(function(resourceItem) {
              var active = props.activeResource && resourceItem.id === props.activeResource.id;
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
