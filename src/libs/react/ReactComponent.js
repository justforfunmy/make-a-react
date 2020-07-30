import { renderComponent } from '../react-dom/diff';

export default class Component {
  constructor(props) {
    this.props = props;
  }

  /**
   *
   * @param {*} state 新的state
   * @param {*} callback 回调函数
   */
  setState(state, callback) {
    this.state = {
      ...this.state,
      ...state
    };
    renderComponent(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {}
}
