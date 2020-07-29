import handleLifeCycle from './lifeCycle';
import emptyContainer from './emptyContainer';

// 添加属性
function setProperty(element, props) {
  for (const key in props) {
    if (props.hasOwnProperty(key) && key !== 'children') {
      if (key === 'className') {
        element.setAttribute('class', props[key]);
      } else if (key === 'onClick') {
        element.addEventListener('click', props[key]);
      } else {
        element.setAttribute(key, props[key]);
      }
    }
  }
}

// 生命周期
function executeLifeCycle(instance) {
  if (!instance.vnode.update) {
    handleLifeCycle(instance, 'componentWillMount');
  }
  if (instance.vnode.update) {
    handleLifeCycle(instance, 'componentWillReceiveProps');
    if (!handleLifeCycle(instance, 'shouldComponentUpdate', instance.state, instance.props)) {
      return null;
    }
    emptyContainer(instance.rDom);
  }
  const vdom = instance.render();
  if (!instance.vnode.update) {
    handleLifeCycle(instance, 'componentDidMount');
  }
  if (instance.vnode.update) {
    handleLifeCycle(instance, 'componentDidUpdate');
  }
  return vdom;
}

/**
 *
 * @param {*} vnode 组件
 * @param {*} container 父级容器
 * @param {*} callback 回调函数
 */
function renderComponent(vnode, container, callback) {
  if (!vnode) {
    return container;
  }
  if (typeof vnode === 'string') {
    const text = document.createTextNode(vnode);
    container.appendChild(text);
    return text;
  }
  const { props, type } = vnode;

  if (typeof type === 'function') {
    let vdom;
    let rDom;
    if (type.prototype && type.prototype.render) {
      // 如果是挂载阶段，需要实例化
      if (!vnode.update) {
        // eslint-disable-next-line new-cap
        const ins = new type(props);
        ins.vnode = vnode;
        ins.container = container;
        vdom = executeLifeCycle(ins);
        rDom = renderComponent(vdom, container);
        ins.rDom = rDom;
        return rDom;
      }
      vdom = executeLifeCycle(this);
    } else {
      vdom = type(props);
    }
    return renderComponent(vdom, container);
  }
  if (typeof type === 'string') {
    const element = document.createElement(type);
    setProperty(element, props);
    if (props.children) {
      if (Array.isArray(props.children)) {
        props.children.forEach((item) => {
          element.appendChild(renderComponent(item, element));
        });
      } else {
        element.appendChild(renderComponent(props.children, element));
      }
    }
    container.appendChild(element);
    return element;
  }

  return container;
}

function render(vnode, container, callback) {
  emptyContainer(container);
  return renderComponent(vnode, container, callback);
}

export { renderComponent, render };
