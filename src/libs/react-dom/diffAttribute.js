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

export { diffAttribute, setArribute };
