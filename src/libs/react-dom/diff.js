import { diffComponent } from './diffComponent';
import { diffAttribute } from './diffAttribute';
import { diffChildren } from './diffChildren';

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

function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode, container);
  if (container) {
    container.appendChild(ret);
  }

  return ret;
}

export default diff;
