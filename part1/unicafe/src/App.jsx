import { useState } from 'react';

// Define the Button component outside the App component
const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

// Define the StatisticLine component outside the App component
const StatisticLine = ({ text, value }) => {
  return (
    <p>
      {text} {value}
    </p>
  );
};

// Update the Statistics component to use the StatisticLine component
const Statistics = ({ good, neutral, bad, total, average, positivePercentage }) => {
  return (
    <div>
      <h1>statistics</h1>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={average.toFixed(2)} />
      <StatisticLine text="positive" value={`${positivePercentage.toFixed(2)} %`} />
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positivePercentage, setPositivePercentage] = useState(0);

  const updateStatistics = (newGood, newNeutral, newBad) => {
    const totalFeedback = newGood + newNeutral + newBad;
    setTotal(totalFeedback);
    if (totalFeedback > 0) {
      setAverage((newGood - newBad) / totalFeedback);
      setPositivePercentage((newGood / totalFeedback) * 100);
    } else {
      setAverage(0);
      setPositivePercentage(0);
    }
  };

  const handleGoodClick = () => {
    const newGood = good + 1;
    setGood(newGood);
    updateStatistics(newGood, neutral, bad);
  };

  const handleNeutralClick = () => {
    const newNeutral = neutral + 1;
    setNeutral(newNeutral);
    updateStatistics(good, newNeutral, bad);
  };

  const handleBadClick = () => {
    const newBad = bad + 1;
    setBad(newBad);
    updateStatistics(good, neutral, newBad);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      {total > 0 ? (
        <Statistics 
          good={good} 
          neutral={neutral} 
          bad={bad} 
          total={total} 
          average={average} 
          positivePercentage={positivePercentage} 
        />
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
};

export default App;
