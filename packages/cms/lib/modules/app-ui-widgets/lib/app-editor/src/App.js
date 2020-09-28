import React from 'react';
import logo from './logo.svg';
import './App.css';

/* Layout elements */
import LeftPanel from './Layout/LeftPanel.js';
import TopPanel from './Layout/TopPanel.js';
import MiddlePanel from './Layout/MiddlePanel.js';
import RightPanel from './Layout/RightPanel.js';
import ListItem from './Layout/ListItem.js';


const listItems = [
  {
    title: 'Step 1'
  },
  {
    title: 'Step 2'
  },
]

function App() {

  return (
    <div className="App">
      <TopPanel>
        <a href="#"> My Apps </a>
      </TopPanel>
      <LeftPanel>
      {listItems.map(function(listItem) {
        return(
          <ListItem>
            {listItem.title}
          </ListItem>
        )
      })}
      <a href="#"> Add a step </a>

      </LeftPanel>
      <MiddlePanel>
        <a href="#"> Map View </a> | <a href="#"> Preview </a>

      </MiddlePanel>
      <RightPanel>
        M
      </RightPanel>
    </div>
  );
}

export default App;
