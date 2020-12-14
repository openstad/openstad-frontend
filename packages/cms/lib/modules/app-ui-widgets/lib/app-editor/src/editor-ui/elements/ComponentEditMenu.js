import React, { useState } from "react";
import { Edit, Trash, Move } from 'react-feather';

const ComponentEditMenu = (props) => {
  return (
    <EditMenu>
      <a href="#">
        <Move />
      </a>
      <a href="#" onClick={() => {
        props.displayEditForm(props.component)
      }}>
        <Edit />
      </a>
      <a href="#" onClick={() => {
        props.displayTrashForm(props.component)
      }}>
        <Trash />
      </a>
    </EditMenu>
  );
}

export default ComponentEditMenu;
