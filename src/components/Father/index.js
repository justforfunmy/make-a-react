import React from '../../libs/react';
import Son from '../Son';

const Father = (props) => (
  <div className="father">
    <h1>component:father</h1>
    <span className="title">FromAppText:{props.name}</span>
    <Son title="welcome" />
  </div>
);

export default Father;
