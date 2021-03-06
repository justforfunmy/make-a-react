import { enqueueSetState } from '../react-dom/stateQueue';

export default class Component {
  constructor(props) {
    this.props = props;
    this.memorizedState = [];
    this.cursor = 0;
  }

  /**
   *
   * @param {*} stateChange 新的state
   * @param {*} callback 回调函数
   */
  setState(stateChange, callback) {
    enqueueSetState(stateChange, this, callback);
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {}
}
