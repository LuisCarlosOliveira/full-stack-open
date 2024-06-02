import { useState } from "react";

const App = () => {
  const [satisfied, setSatisfied] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [unsatisfied, setUnsatisfied] = useState(0);
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

  const handleSatisfied = () => {
    const newSatisfied = satisfied + 1;
    setSatisfied(newSatisfied);
    updateStatistics(newSatisfied, neutral, unsatisfied);
  };

  const handleNeutral = () => {
    const newNeutral = neutral + 1;
    setNeutral(newNeutral);
    updateStatistics(satisfied, newNeutral, unsatisfied);
  };

  const handleUnsatisfied = () => {
    const newUnsatisfied = unsatisfied + 1;
    setUnsatisfied(newUnsatisfied);
    updateStatistics(satisfied, neutral, newUnsatisfied);
  };

  return (
    <div>
      <h1>Survey Tracker</h1>
      <button onClick={() => handleSatisfied}>Satisfied</button>
      <button onClick={() => handleNeutral}>Neutral</button>
      <button onClick={() => handleUnsatisfied}>Unsatisfied</button>
      <h1>Statistics</h1>
      <p>Satisfied: {satisfied}</p>
      <p>Neutral: {neutral}</p>
      <p>Unsatisfied: {unsatisfied}</p>
      <p>all {total}</p>
      <p>average {average.toFixed(2)}</p>
      <p>positive {positivePercentage.toFixed(2)} %</p>
    </div>
  );
};

export default App;
