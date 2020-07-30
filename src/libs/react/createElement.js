// eslint-disable
function mapConfigToProps(props, config) {
  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      props[key] = config[key];
    }
  }
}

function hasValidKey(config) {
  return config.key !== undefined;
}

function hasValidRef(config) {
  return config.ref !== undefined;
}
/**
 *
 * @param {*} type 组件本身
 * @param {*} config 组件属性
 * @param {*} children 子组件
 */
function createElement(type, config, children) {
  const props = {};
  let key = null;
  let ref = null;
  if (config != null) {
    // 验证ref和key是否有效，ref和key要单独处理
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = `${config.key}`;
    }
  }
  mapConfigToProps(props, config);

  const childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);

    for (let i = 0; i < childrenLength; i += 1) {
      // eslint-disable-next-line prefer-rest-params
      childArray[i] = arguments[i + 2];
    }

    if (Object.freeze) {
      Object.freeze(childArray);
    }
    props.children = childArray;
  }
  return {
    type,
    key,
    ref,
    props
  };
}

export default createElement;
