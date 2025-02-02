import { useState, useEffect } from 'react';
import personService from './services/PersonService';
import './App.css'

function App() {
  const [persons, setPersons] = useState([]);
  
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  return (
    <>
      <h1>Phonebook</h1>
      <ul>
        {persons.map(person => 
          <li key={person.id}>
            {person.name} - {person.number}
          </li>
        )}
      </ul>
    </>
  )
}

export default App;