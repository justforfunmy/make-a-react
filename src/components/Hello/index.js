import React from '../../libs/react';
import Welcome from '../Welcome';

const Hello = (props) => (
  <div className="wrapper">
    <Welcome title="welcome" />
    <span className="title">{props.name}</span>
  </div>
);

export default Hello;
