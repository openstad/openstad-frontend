import React from 'react';

import './Layout.css';

/**
 * AppPreviewer allows for different devices views regardless of it's content
 */
function AppPreviewer (props) {
  return (
    <div className>
      <div class="device-selector">
        <a href="#"> <img src="/icon-mobile.svg" /> </a>
        <a href="#"> <img src="/icon-tablet.svg" /> </a>
        <a href="#"> <img src="/icon-desktop.svg" /> </a>
      </div>
      <div className="device-wrapper device-wrapper-mobile">
        <div className="device-wrapper-inner">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default AppPreviewer;
