import React, { Component, useLocation } from 'react';

/* Layout elements */
import LeftPanel from './Layout/LeftPanel.js';
import TopPanel from './Layout/TopPanel.js';
import MiddlePanel from './Layout/MiddlePanel.js';
import RightPanel from './Layout/RightPanel.js';
import ListItem from './Layout/ListItem.js';
import AppPreviewer from './Layout/AppPreviewer.js';
import Section from './Layout/Section.js';

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

export default UI;
