import { renderComponent } from '../react-dom/DomRender';

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
    this.vnode.update = true;
    renderComponent.call(this, this.vnode, this.rDom);
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {}
}
