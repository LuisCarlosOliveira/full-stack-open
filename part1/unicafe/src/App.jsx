import { useState } from 'react';

// Define the Statistics component outside the App component
const Statistics = ({ good, neutral, bad, total, average, positivePercentage }) => {
  return (
    <div>
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {average.toFixed(2)}</p>
      <p>positive {positivePercentage.toFixed(2)} %</p>
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
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>
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
