import diff from './diff';

function render(vnode, container, callback) {
  diff(null, vnode, container);
}

export { render };
