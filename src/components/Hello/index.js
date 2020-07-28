import React from '../../libs/index';
import A from '../Welcome';

const Hello = (props) => (
  <div className="wrapper">
    <A title="welcome" />
    <span className="title">{props.name}</span>
    <span>123456</span>
  </div>
);

export default Hello;
