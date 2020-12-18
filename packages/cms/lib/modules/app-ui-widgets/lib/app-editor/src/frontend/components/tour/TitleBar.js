import React, { Component } from 'react';

function TitleBar (props) {
  return (
    <div className="title-bar">
      <a href="#" className="title-bar-back-button">
        <img src="/arrow-left-circle.svg" />
      </a>
      <span className="title-bar-title">
        {props.title}
      </span>
    </div>
  )
}

export default TitleBar;
