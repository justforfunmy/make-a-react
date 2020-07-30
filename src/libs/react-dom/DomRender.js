import handleLifeCycle from './lifeCycle';
import emptyContainer from './emptyContainer';
import diff from './diff';

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
function executeLifeCycle(instance, container) {
  if (!instance.rdom) {
    handleLifeCycle(instance, 'componentWillMount');
    const vdom = instance.render();
    const rdom = renderComponent(vdom, container);
    instance.rdom = rdom;
    handleLifeCycle(instance, 'componentDidMount');
  } else {
    handleLifeCycle(instance, 'componentWillReceiveProps');
    if (!handleLifeCycle(instance, 'shouldComponentUpdate', instance.state, instance.props)) {
      return null;
    }
    const vdom = instance.render();
    emptyContainer(instance.rdom);
    const rdom = renderComponent(vdom, container);
    instance.rdom = rdom;
    handleLifeCycle(instance, 'componentDidUpdate');
  }
  return instance.rdom;
}

/**
 *
 * @param {*} vnode 组件
 * @param {*} container 父级容器
 * @param {*} callback 回调函数
 */
function renderComponent(vnode, container, callback) {
  // 如果组件为空，则停止渲染，用于处理shouldComponentUpdate返回false的情况
  if (!vnode) {
    return container;
  }

  const { props, type } = vnode;
  let vdom;
  let ins;

  // 如果是vnode是字符串，则处理为字符节点
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    const text = document.createTextNode(vnode);
    container.appendChild(text);
    return text;
  }

  if (type.prototype && type.prototype.render) {
    if (this && this.rdom) {
      ins = this;
    } else {
      // eslint-disable-next-line new-cap
      ins = new type(props);
      ins.vnode = vnode;
      ins.container = container;
    }
    const rdom = executeLifeCycle(ins, container);
    return rdom;
  }

  if (typeof type === 'function' && !type.prototype.render) {
    ins = {};
    ins.vnode = vnode;
    ins.container = container;
    vdom = type(props);
    const rdom = renderComponent(vdom, container);
    ins.rdom = rdom;
    return rdom;
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
  diff(null, vnode, container);
}

export { renderComponent, render };
