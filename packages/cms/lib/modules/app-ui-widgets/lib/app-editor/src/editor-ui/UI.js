import React, { Component, useLocation } from 'react';

/* Layout elements */
import LeftPanel from './layout/LeftPanel';
import TopPanel from './layout/TopPanel';
import MiddlePanel from './layout/MiddlePanel';
import RightPanel from './layout/RightPanel';
import ListItem from './layout/ListItem';
import Section from './layout/Section';

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
