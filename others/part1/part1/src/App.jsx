import Hello from './components/Hello';
import Bye from './components/Bye';
import './App.css'

const App = () => {
  const now = new Date().toLocaleTimeString();
  const a = 10;
  const b = 20;

  return (
    <div>
      <p>Hi, it is {now}</p>
      <p>{a} + {b} = {a + b}</p>
      <Hello name="George" />
      <Hello name="Daisy" />
      <Bye name="George" />
    </div>
  )
}

export default App;