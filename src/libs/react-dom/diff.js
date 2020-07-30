import Component from '../react/ReactComponent';

/**
 *
 * @param {HTMLElement} dom 真实dom
 * @param {vnode} vnode 新的虚拟dom
 * @returns {HTMLElement} 新的真实dom
 */
function diffNode(dom, vnode) {
  let out = dom;
  // 对于虚拟dom是字符
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    // 如果当前的DOM就是文本节点，则直接更新内容
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode;
      }
    } else {
      // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
      out = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }
    return out;
  }
  // 如果虚拟dom是函数组件或者类组件
  if (typeof vnode.type === 'function') {
    return diffComponent(out, vnode);
  }

  // 非文本dom节点
  if (!dom) {
    out = document.createElement(vnode.type);
  }

  if ((vnode.props && vnode.props.children) || out.childNodes.length > 0) {
    diffChildren(out, vnode.props.children);
  }

  diffAttribute(out, vnode);

  return out;
}

function diffAttribute(dom, vnode) {
  // dom原来的节点，vnode虚拟的节点
  const oldAttris = {};
  const newAttris = vnode.props;
  const domAttrs = dom.attributes;
  [...domAttrs].forEach((item) => {
    oldAttris[item.name] = item.value;
  });
  // 对比属性,老属性不在新属性中，移除老的属性
  for (const key in oldAttris) {
    if (!(key in newAttris)) {
      setArribute(dom, key, undefined);
    }
  }
  // 属性不一致，重置属性
  for (const key in newAttris) {
    if (oldAttris[key] !== newAttris[key] && key !== 'children') {
      setArribute(dom, key, newAttris[key]);
    }
  }
}

function setArribute(dom, key, value) {
  // class
  if (key === 'className') {
    key = 'class';
  }
  // 事件
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || '';
  } else if (key === 'style') {
    // 样式
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && typeof value === 'object') {
      for (const k in value) {
        if (typeof value[k] === 'number') {
          dom.style[k] = `${value[k]}px`;
        } else {
          dom.style[k] = value[k];
        }
      }
    }
  } else {
    if (key in dom) {
      dom[key] = value;
    }
    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
}

function diffChildren(dom, vChildren) {
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};
  // 把有key 的dom 跟没有key 的dom 区分开
  if (domChildren && domChildren.length > 0) {
    domChildren.forEach((domChild) => {
      const key = domChild.getAttribute && domChild.getAttribute('key');
      if (key) keyed[key] = domChild;
      else children.push(domChild);
    });
  }

  if (!Array.isArray(vChildren)) {
    vChildren = [vChildren];
  }

  if (vChildren && vChildren.length > 0) {
    let min = 0;
    let childrenLen = children.length;
    vChildren.forEach((vChild, i) => {
      let child;
      const { key } = vChild;
      if (key) {
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        for (let j = min; j < childrenLen; j++) {
          const c = children[j];
          if (c) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }

      // 对比
      child = diff(child, vChild);

      // 更新DOM
      const f = domChildren[i];
      if (child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(child);
          // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
        } else if (child === f.nextSibling) {
          removeNode(f);
          // 将更新后的节点移动到正确的位置
        } else {
          // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
          dom.insertBefore(child, f);
        }
      }
    });
  }
}

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

export function renderComponent(component) {
  let base;

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
  removeNode(comp.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom);
  }
}

function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode, container);
  if (container) {
    container.appendChild(ret);
  }

  return ret;
}

export default diff;
