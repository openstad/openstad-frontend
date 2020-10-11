import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* Layout elements */
import LeftPanel from './Layout/LeftPanel.js';
import TopPanel from './Layout/TopPanel.js';
import MiddlePanel from './Layout/MiddlePanel.js';
import RightPanel from './Layout/RightPanel.js';
import ListItem from './Layout/ListItem.js';

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
        <a href="#"> Map View </a> | <a href="#"> Preview </a>
      </MiddlePanel>
      <RightPanel open={!!props.rightPanel}>
        <button onClick={props.rightPanelClose}> x </button>
        {props.rightPanel ? props.rightPanel : <div />}
      </RightPanel>
  </div>
  )
}


function Sidebar (props) {
  return <div>
    {props.resourceItems.map(function(resourceItem) {
        return(
          <ListItem>
            {resourceItem.data.title}
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
          <input type="" name="name"/>
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
      activeResource: null
    };
  }

  newResource() {
    this.setState({
      activeResource: this.props.newResourceObject
    })
  }

  render() {
    return (
      <UI
        sidebar={
          <Sidebar
            resourceItems={this.props.resourceItems}
            edit={(resource) => {
              this.setState({
                activeResource: resource
              })
            }}
            new={this.newResource.bind(this)}
          />
        }
        rightPanel={
          this.state.activeResource ?
            <ResourceForm
              resource={this.state.activeResource}
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
