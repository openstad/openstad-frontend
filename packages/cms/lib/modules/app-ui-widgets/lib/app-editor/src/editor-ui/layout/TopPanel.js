import React from 'react';
import './Layout.css';

function TopPanel(props) {
  return (
    <div className="TopPanel">
      {props.children}
    </div>
  );
}

export default TopPanel;
