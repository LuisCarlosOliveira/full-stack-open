import { useState, useEffect } from "react";
import { getAll } from "./services/PersonService"; // Importação nomeada
import Person from "./components/Person";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((error) => {
        console.error("Failed to fetch persons:", error);
        alert("Failed to load data. Please try again later.");
      });
  }, []);

  return (
    <>
      <h1>Phonebook</h1>
      <ul>
        {persons.map((person) => (
          <Person key={person.id} person={person} />
        ))}
      </ul>
    </>
  );
}

export default App;
