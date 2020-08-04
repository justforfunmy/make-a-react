import Component from '../react/ReactComponent';
import diff from './diff';
import { setCurrentComponent } from './current';

function diffComponent(dom, vnode) {
  let c = dom && dom._component;
  let oldDom = dom;

  // 如果组件类型没有变化，则重新set props
  if (c && c.constructor === vnode.type) {
    setComponentProps(c, vnode.props);
    dom = c.base;
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
  } else {
    if (c) {
      unmountComponent(c);
      oldDom = null;
    }

    c = createComponent(vnode.type, vnode.props);

    setComponentProps(c, vnode.props);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      removeNode(oldDom);
    }
  }

  return dom;
}

// 创建组件
function createComponent(component, props) {
  let inst;
  // 如果是类定义组件，则直接返回实例
  if (component.prototype && component.prototype.render) {
    inst = new component(props);
    // 如果是函数定义组件，则将其扩展为类定义组件
  } else {
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function () {
      setCurrentComponent(this);
      return this.constructor(props);
    };
  }

  return inst;
}

// set props
function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  component.props = props;

  renderComponent(component);
}

function renderComponent(component) {
  let base;

  // hooks的cursor置零，按顺序从头执行hook
  component.cursor = 0;

  const renderer = component.render();

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  base = diff(component.base, renderer);

  if (component.base) {
    if (component.componentDidUpdate) component.componentDidUpdate();
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }
  component.base = base;
  base._component = component;
}

function unmountComponent(comp) {
  if (comp.componentWillUnmount) comp.componentWillUnmount();
  if (comp.unmount) comp.unmount();
  removeNode(comp.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }
}

export { renderComponent, diffComponent };
