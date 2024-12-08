import React, { useState } from "react";
import Greeting from './components/Greeting'
import GreetingsProps from './components/GreetingsProps'
import GreetDestructed from './components/GreetDestructed'
import Button from "./components/Button";
import Status from "./components/Status";
import MostFrequent from "./components/MostFrequent";
import DesClickHistory from "./components/DesClickHistory";


const App = () => {
  const [counter, setCounter] = useState(0);
  const [funcCounter, setFuncCounter] = useState(0);
  const [name, setName] = useState('Charlie')
  const [clickHistory, setClickHistory] = useState([])


  const handleFuncCounter = () => {
    setFuncCounter(funcCounter + 1);
    setClickHistory([...clickHistory, "Increment"])
  };
  const handleFuncCounterReset = () => {
    setFuncCounter(0);
    setClickHistory([...clickHistory, "Reset"])
  }

  const handleNameChange = () => {
    setName(name === 'Charlie' ? 'Dana' : 'Charlie')
    setClickHistory([...clickHistory, "Change Name"])
  }

  return (
    <div>
      <h1>Hello, React!</h1>
      <p>This is my first React component.</p>
      <Greeting />
      <GreetingsProps name = "Luís" />
      <GreetDestructed name = {name} age = {100} />
      <button onClick={() => setCounter(counter + 1)}>{counter}</button>
      <div> </div>
      <button onClick={handleFuncCounter}>{funcCounter}</button>
      <button onClick={handleFuncCounterReset}>Reset</button>
      <button onClick={handleNameChange}>Change Name in Greeting Above</button>
      <p>--- Reuse button ---</p>
      <Button onClick={handleNameChange} text=  "change name"/>
      <Button onClick={handleFuncCounterReset} text=  "Reset"/>
      <Button onClick={handleFuncCounter} text= {funcCounter}/>
      <Status counter={funcCounter} />
      <ul>
        {clickHistory.map((action,index) =>(
          <li key={index}>{action}</li>
        ))}
      </ul>
      <MostFrequent arr={clickHistory}/>
      <p>--- Reuse History ---</p>        
      <DesClickHistory />

    </div>

  )
}

export default App
