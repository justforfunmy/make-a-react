import React from '../../libs/react';
import Son from '../Son';
import { useState, useEffect } from '../../libs/react/hooks';

const Demo = (props) => {
  console.log('demo function run');
  const [count, setCount] = useState(2);
  const [number, setNumber] = useState(1);
  const handleClick = () => {
    setNumber(number * 2);
  };
  useEffect(() => {
    setCount(6);
    console.log(count);
    return () => {
      console.log('unmount');
    };
  }, [number]);
  // useEffect(() => {
  //   console.log(number);
  // }, [number]);
  return (
    <div>
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <div>number:{number}</div>
      <button onClick={handleClick}>x2</button>
    </div>
  );
};

const Father = (props) => {
  const [a, setA] = useState(3);
  return (
    <div className="father">
      {/* <h1>component:father</h1>
      <span className="title">FromAppText:{props.name}</span>
      <Son title="welcome" /> */}

      <div>number:{a}</div>
      <button onClick={() => setA(a * 10)}>x10</button>
      {a > 10 && <Demo />}
    </div>
  );
};

export default Father;
