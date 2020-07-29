/**
 *
 * @param {*} host 组件实例
 * @param {*} name 生命周期名称
 * @param {*} args 生命周期函数入参
 */
function handleLifeCycle(host, name, ...args) {
  if (host[name]) {
    // eslint-disable-next-line prefer-spread
    return host[name].apply(host, args);
  }
  return null;
}

export default handleLifeCycle;
