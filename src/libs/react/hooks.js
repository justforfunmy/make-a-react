import { renderComponent } from '../react-dom/diffComponent';

function useState(initialState) {
  const comp = window.currentComponent;
  const { memorizedState, cursor } = comp;
  memorizedState[cursor] = memorizedState[cursor] || initialState;
  const currentCursor = cursor;
  function setState(stateChange) {
    memorizedState[currentCursor] = stateChange;
    renderComponent(comp);
  }
  return [memorizedState[comp.cursor++], setState];
}

function useEffect(callback, depArray) {
  const comp = window.currentComponent;
  const { memorizedState, cursor } = comp;
  const hasNoDeps = !depArray;
  const deps = memorizedState[cursor];
  const hasDepChanged = deps ? !depArray.every((el, i) => deps[i] === el) : true;
  if (hasNoDeps || hasDepChanged) {
    memorizedState[cursor] = depArray;
    callback();
  }
  comp.cursor++;
}

export { useState, useEffect };
