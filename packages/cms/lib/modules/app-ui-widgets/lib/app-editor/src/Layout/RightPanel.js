import React from 'react';
import './Layout.css';

function RightPanel(props) {
  var className = "RightPanel";
  className = props.open ? className + " open" : '';

  return (
    <div className={className}>
      {props.children}
    </div>
  );
}

export default RightPanel;
