import React from '../../libs/index';
import logo from '../../assets/logo.png';

export default class Welcome extends React.Component {
  constructor() {
    super(...arguments);
  }

  render() {
    return (
      <div>
        <span>{this.props.title}</span>
        <img src={logo} />
      </div>
    );
  }
}
