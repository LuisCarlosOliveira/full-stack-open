import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Button from './components/Button'
import Statistics from './components/Statistics'

function App() {
  const [count, setCount] = useState(0)
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
    setCount(count + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
    setCount(count + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
    setCount(count + 1)
  }

  return (
    <>
      <Header text="Give Feedback" />
      <Button onClick={handleGood} text="Good" />
      <Button onClick={handleNeutral} text="Neutral" />
      <Button onClick={handleBad} text="Bad" />
      <Statistics good={good} neutral={neutral} bad={bad} count={count} />
    </>
  )
}

export default App
