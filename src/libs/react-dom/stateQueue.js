import { renderComponent } from './diffComponent';

const queue = [];
const renderQueue = [];

/**
 *入队
 * @param {*} state 组件状态
 * @param {*} component 组件实例
 * @param {*} callbak 回调函数
 */
function enqueueSetState(state, component, callback) {
  // 如果queue的长度是0，也就是在上次flush执行之后第一次往队列里添加
  if (queue.length === 0) {
    defer()(flushQueue);
  }
  queue.push({ state, component, callback });
  // 如果待渲染的组件队列中不含有该组件，则组件队列中加入该组件
  if (!renderQueue.some((item) => item === component)) {
    enqueueRender(component);
  }
}

function enqueueRender(component) {
  renderQueue.push(component);
}

function flushQueue() {
  let stateItem;
  let componentItem;
  let nextState;
  // 从头部开始遍历状态队列，每遍历一个删除一个
  while ((stateItem = queue.shift())) {
    const { state, component, callback } = stateItem;
    // 组件原先没有state，则赋值新的state
    if (!component.state) {
      nextState = { ...state };
    } else {
      // 组件原先有state，则浅合并
      nextState = { ...component.state, ...state };
    }
    // 将组件赋予新的state
    component.state = nextState;
    // 如果有回调函数，则同步执行回调函数,并绑定组件实例
    if (typeof callback === 'function') {
      callback.call(component);
    }
  }

  // 遍历待渲染组件，此时组件的状态可能是多次合并的结果
  while ((componentItem = renderQueue.shift())) {
    renderComponent(componentItem);
  }
}

function defer() {
  return function (fn) {
    // 当浏览器空闲时，执行清空队列操作
    requestIdleCallback(fn);
  };
}

export { enqueueSetState, flushQueue };
