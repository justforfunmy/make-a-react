/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import React from '../../libs/react/index';

export default class Son extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      name: 'son'
    };
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    console.log('did mount');
    for (let i = 0; i < 10; i++) {
      this.setState(
        {
          name: Math.random()
        },
        () => {
          console.log(this.state.name);
        }
      );
    }
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
      <div className="son">
        <h1>component:son</h1>
        <span>FromFatherTitle:{this.props.title}</span>
        <div>statename:{this.state.name}</div>
        <button onClick={this.handleClick.bind(this)}>{1}</button>
      </div>
    );
  }
}
