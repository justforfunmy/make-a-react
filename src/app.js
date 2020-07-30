import React from './libs/react';
import Father from './components/Father';

export default class App extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      appText: 'App'
    };
  }

  handleClick() {
    this.setState({
      appText: '123'
    });
  }

  render() {
    return (
      <div className="app">
        <h1>component:App</h1>
        <div>appText:{this.state.appText}</div>
        <button onClick={this.handleClick.bind(this)}>click</button>
        <Father name={this.state.appText} />
      </div>
    );
  }
}
