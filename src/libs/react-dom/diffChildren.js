import diff from './diff';

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

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom);
  }
}

export { diffChildren };
