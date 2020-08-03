import { renderComponent } from '../react-dom/diffComponent';

const memorizedState = [];
let cursor = 0;

function useState(initialState) {
  const comp = window.currentComponent;
  memorizedState[cursor] = memorizedState[cursor] || initialState;
  const currentCursor = cursor;
  function setState(stateChange) {
    memorizedState[currentCursor] = stateChange;
    cursor = 0;
    renderComponent(comp);
  }
  return [memorizedState[cursor++], setState];
}

function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = memorizedState[cursor];
  const hasDepChanged = deps ? !depArray.every((el, i) => deps[i] === el) : true;
  if (hasNoDeps || hasDepChanged) {
    callback();
    memorizedState[cursor] = depArray;
  }
  cursor++;
}

export { useState, useEffect };
