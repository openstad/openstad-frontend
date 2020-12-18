import React from 'react';

import './Layout.css';

function ListItem(props) {
  var className = props.active ? 'ListItem active' : 'ListItem';
  return (
    <div className={className}>
      {props.children}
    </div>
  );
}

export default ListItem;
