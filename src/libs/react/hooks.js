import { renderComponent } from '../react-dom/diffComponent';
import { getCurrentComponent } from '../react-dom/current';

function useState(initialState) {
  const comp = getCurrentComponent();
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
  const comp = getCurrentComponent();
  const { memorizedState, cursor } = comp;
  const hasNoDeps = !depArray;
  const deps = memorizedState[cursor];
  const hasDepChanged = deps ? !depArray.every((el, i) => deps[i] === el) : true;
  if (hasNoDeps || hasDepChanged) {
    memorizedState[cursor] = depArray;
    Promise.resolve().then(() => {
      const res = callback();
      if (typeof res === 'function') {
        comp.unmount = res;
      }
    });
  }
  comp.cursor++;
}

export { useState, useEffect };
