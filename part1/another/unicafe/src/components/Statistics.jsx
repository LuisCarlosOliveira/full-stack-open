import React, { useState } from "react";
import StatisticLine from "./StatisticLine";

function Statistics(props) {
  const { good, neutral, bad, count } = props;
  const all = count;
  const positivePercentage = all > 0 ? (good / all) * 100 : 0;
  let average = "";

  if (all === 0) {
    return <p>No feedback given</p>;
  }
  if (good > neutral && good > bad) {
    average = "good";
  } else if (neutral > good && neutral > bad) {
    average = "neutral";
  } else {
    average = "bad";
  }

  return (
    <>
      <h1>Statistics</h1>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="All" value={all} />
      <StatisticLine text="Average" value={average} />     
      <StatisticLine text="Positive" value={`${positivePercentage.toFixed(2)} %`} />
    </>
  );
}

export default Statistics;
