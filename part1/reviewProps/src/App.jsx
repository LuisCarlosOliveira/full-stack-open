import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Greeting from './components/Greeting';
import DesGreeting from './components/DestructuringGreeting'
import UserList from './components/UserList'

function App() {
  const [count, setCount] = useState(0)
  const users = [
    { name: "Luis", age: 33 },
    { name: "Maria", age: 28 },
    { name: "João", age: 40 },
  ];

  return (
    <>
      <Greeting name = "Luís" age = "33" />
      <DesGreeting name = "Carlos" age = "33" />
      <UserList users = {users} />
    </>
  )
}

export default App
