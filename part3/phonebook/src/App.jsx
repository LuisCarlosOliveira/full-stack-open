import { useState, useEffect, useCallback } from "react";
import PersonService from "./services/PersonService";
import Person from "./components/Person";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
  });
  const [error, setError] = useState(null);
  const [personId, setPersonId] = useState("");
  const [person, setPerson] = useState(null);

  // Fetch persons on component mount
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const initialPersons = await PersonService.getAll();
        setPersons(initialPersons);
      } catch (error) {
        console.error("Failed to fetch persons:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchPersons();
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle form submission for searching by ID
  const handleSubmitToGetByID = async (event) => {
    event.preventDefault();
    if (!personId.trim()) {
      setError("Please enter an ID");
      setPerson(null);
      return;
    }

    try {
      const returnedPerson = await PersonService.getById(personId.trim());
      setPerson(returnedPerson);
      setError(null);
    } catch (error) {
      console.error("Error getting person:", error);
      setError(error.message || "Failed to get person. Please try again.");
      setPerson(null);
    }
  };

  // Add a clear button
  const handleClearSearch = () => {
    setPersonId("");
    setPerson(null);
    setError(null);
  };

  // Handle form submission for adding a new person
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const returnedPerson = await PersonService.create({
        name: formData.name.trim(),
        number: formData.number.trim(),
      });

      setPersons((prev) => [...prev, returnedPerson]);
      setFormData({ name: "", number: "" });
      setError(null);
    } catch (error) {
      console.error("Error creating person:", error);
      setError(error.message || "Failed to create person. Please try again.");
    }
  };

  // Handle person deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this person?")) {
      return;
    }

    try {
      await PersonService.delete(id);
      setPersons((prev) => prev.filter((person) => person.id !== id));
      setError(null);
    } catch (error) {
      console.error("Error deleting person:", error);
      setError(error.message || "Failed to delete person. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Phonebook</h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="number" className="block mb-2">
            Number:
          </label>
          <input
            id="number"
            name="number"
            type="tel"
            value={formData.number}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>

      <ul className="space-y-2">
        {persons.map((person) => (
          <li
            key={person.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <Person person={person} />
            <button
              onClick={() => handleDelete(person.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmitToGetByID}
        className="mb-6 mt-8 border-t pt-6"
      >
        <h2 className="text-xl font-bold mb-4">Search Person by ID</h2>
        <div className="mb-4">
          <label htmlFor="personId" className="block mb-2">
            Person ID:
          </label>
          <div className="flex gap-2">
            <input
              id="personId"
              name="personId"
              type="text"
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
              placeholder="Enter person ID"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {person && (
        <div className="mt-4 space-y-4">
          <div className="p-4 border rounded bg-gray-100">
            <h2 className="text-xl font-bold mb-3">Person Details</h2>
            <div className="space-y-2">
              <p className="grid grid-cols-[100px_1fr]">
                <strong>ID:</strong> <span>{person.id}</span>
              </p>
              <p className="grid grid-cols-[100px_1fr]">
                <strong>Name:</strong> <span>{person.name}</span>
              </p>
              <p className="grid grid-cols-[100px_1fr]">
                <strong>Number:</strong> <span>{person.number}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearSearch}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
          >
            Clear Search Results
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
