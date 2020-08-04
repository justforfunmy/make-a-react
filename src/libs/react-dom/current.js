let currentComponent = null;

function setCurrentComponent(comp) {
  currentComponent = comp;
}

function getCurrentComponent() {
  return currentComponent;
}

export { getCurrentComponent, setCurrentComponent };
