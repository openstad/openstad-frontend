import React from 'react';
import './Layout.css';

function ListItem(props) {
  return (
    <div className="ListItem">
      {props.children}
    </div>
  );
}

export default ListItem;
