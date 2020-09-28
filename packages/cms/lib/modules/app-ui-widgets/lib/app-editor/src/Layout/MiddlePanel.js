import React from 'react';
import './Layout.css';

function MiddlePanel(props) {
  return (
    <div className="MiddlePanel">
      {props.children}
    </div>
  );
}

export default MiddlePanel;
