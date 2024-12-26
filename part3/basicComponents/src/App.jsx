import { useState } from "react";
import Title from "./components/Title";
import SubTitle from "./components/Subtitle";
import Task from "./components/Task";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const tarefas = [
    { id: 1, descricao: 'Aprender React' },
    { id: 2, descricao: 'Estudar JavaScript' },
    { id: 3, descricao: 'Praticar Programação' }
  ];
  return (
    <>
      <Title title="Hello World" />
      <SubTitle title="This is a subtitle" />
      <ul>
        {tarefas.map( (tarefa, id) => 
          <li key={id}>{tarefa.id} : {tarefa.descricao}</li>
        )}
      </ul>
      <p>-----------</p>
      <ul>
        {tarefas.map (tarefa =>
          <Task key = {tarefa.id} descricao = {tarefa.descricao} />
        )}
      </ul>
    </>
  );
}

export default App;
