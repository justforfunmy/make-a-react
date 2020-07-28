/**
 *
 * @param {*} vnode 组件
 * @param {*} container 父级容器
 * @param {*} callback 回调函数
 */
export default function render(vnode, container, callback) {
  // while (container.firstChild) {
  //   container.removeChild(container.firstChild);
  // }

  const { props, type } = vnode;

  if (typeof type === 'function') {
    let vdom;
    if (type.prototype && type.prototype.render) {
      const ins = new type(props);
      vdom = ins.render();
    } else {
      vdom = type(props);
    }

    return render(vdom, container);
  }
  if (typeof type === 'string') {
    const element = document.createElement(type);
    for (const key in props) {
      if (props.hasOwnProperty(key) && key !== 'children') {
        if (key === 'className') {
          element.setAttribute('class', props[key]);
        } else {
          element.setAttribute(key, props[key]);
        }
      }
    }
    if (props.children) {
      if (Array.isArray(props.children)) {
        props.children.forEach((item) => {
          element.appendChild(render(item, element));
        });
      } else if (typeof props.children === 'string') {
        const text = document.createTextNode(props.children);
        element.appendChild(text);
      } else {
        element.appendChild(render(props.children, element));
      }
    }
    container.appendChild(element);
    return element;
  }

  return container;
}
