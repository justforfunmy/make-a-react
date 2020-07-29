/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import React from '../../libs/react/index';
import logo from '../../assets/logo.png';

export default class Welcome extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      name: 'welcome'
    };
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    console.log('did mount');
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
    console.log('did update');
  }

  handleClick() {
    this.setState({
      name: 'hello'
    });
  }

  render() {
    return (
      <div>
        <span>{this.props.title}</span>
        <img src={logo} />
        <div>name:{this.state.name}</div>
        <button onClick={this.handleClick.bind(this)}>change</button>
      </div>
    );
  }
}
