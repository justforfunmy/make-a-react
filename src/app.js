import React from './libs/react';
import Hello from './components/Hello';

export default class App extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      text: 'App'
    };
  }

  handleClick() {
    this.setState({
      text: '123'
    });
  }

  render() {
    return (
      <div>
        <Hello name={this.state.text} />
        <div>text:{this.state.text}</div>
        <button onClick={this.handleClick.bind(this)}>click</button>
      </div>
    );
  }
}
