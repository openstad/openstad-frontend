import React from 'react';
import './Layout.css';

function RightPanel(props) {
  return (
    <div className="RightPanel">
      {props.children}
    </div>
  );
}

export default RightPanel;
