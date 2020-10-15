import React from 'react';

import './Layout.css';

/**
 * AppPreviewer allows for different devices views regardless of it's content
 */
function AppPreviewer (props) {
  return (
    <div className>
      <a href="#"> M </a> | <a href="#"> D </a>
      <div className="device-wrapper device-wrapper-mobile">
        <div className="device-wrapper-inner">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default AppPreviewer;
