import React, { useState, useCallback } from 'react';

function DynamicStepCounter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const handleIncrement = useCallback(() => {
    setCount((prevCount) => prevCount + step);
  }, [step]);

  const handleDecrement = useCallback(() => {
    setCount((prevCount) => prevCount - step);
  }, [step]);

  const handleStepChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 1) {
      setStep(value);
    }
  };

  return (
    <div>
      <p>Count: {count}</p>
      <input
        type="number"
        value={step}
        onChange={handleStepChange}
        placeholder="Define the value of the step"
        min="1"  // Optional, to restrict to positive integers
      />
      <button onClick={handleIncrement}>Increase</button>
      <button onClick={handleDecrement}>Decrease</button>
    </div>
  );
}

export default DynamicStepCounter;
