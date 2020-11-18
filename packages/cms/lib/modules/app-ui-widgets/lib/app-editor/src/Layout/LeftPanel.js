import React from 'react';
import './Layout.css';

function LeftPanel(props) {
  return (
    <div className="LeftPanel">
      {props.children}
    </div>
  );
}

export default LeftPanel;
