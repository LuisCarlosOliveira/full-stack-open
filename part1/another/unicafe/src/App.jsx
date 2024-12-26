import { useState, useCallback } from "react";
import "./App.css";
import Header from "./components/Header";
import Button from "./components/Button";
import Statistics from "./components/Statistics";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const setFeedback = useCallback(
    (feedbackType) => () => {
      if (feedbackType === "good") setGood((prevGood) => prevGood + 1);
      else if (feedbackType === "neutral")
        setNeutral((prevNeutral) => prevNeutral + 1);
      else if (feedbackType === "bad") setBad((prevBad) => prevBad + 1);
    },
    []
  );

  return (
    <div>
      <Header text="Give feedback" />
      <Button onClick={setFeedback("good")} text="Good" />
      <Button onClick={setFeedback("neutral")} text="Neutral" />
      <Button onClick={setFeedback("bad")} text="Bad" />
      <Header text="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
