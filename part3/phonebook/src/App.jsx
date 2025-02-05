import { useState, useEffect } from "react";
import { getAll, create, deletePerson } from "./services/PersonService";
import Person from "./components/Person";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setnewNumber] = useState("");

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

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    create(personObject)
      .then((returnedPerson) => {
        if (returnedPerson) {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setnewNumber("");
        } else {
          console.error("Failed to create person: No data returned");
        }
      })
      .catch((error) => {
        console.error("Error creating person:", error);
        alert("Failed to create person. Please try again.");
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setnewNumber(event.target.value);
  };

  const handleDeletePerson = (id) => {
    deletePerson(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting person:", error);
        alert("Failed to delete person. Please try again.");
      });
  };

  return (
    <>
      <h1>Phonebook</h1>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            <Person person={person} />
            <button onClick={() => handleDeletePerson(person.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={addPerson}>
        <div>
          <label>Name:</label>
          <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <label>Number:</label>
          <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <button type="submit">save</button>
      </form>
    </>
  );
}

export default App;
