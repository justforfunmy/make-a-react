// eslint-disable
function mapConfigToProps(props, config) {
  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      props[key] = config[key];
    }
  }
}
export default function createElement(type, config, children) {
  const props = {};
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
    props
  };
}
