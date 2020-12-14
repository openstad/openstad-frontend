import React, { Component, useLocation } from 'react';

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
