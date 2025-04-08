import { useState, useEffect, useCallback } from "react";
import PersonService from "./services/PersonService";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
  });
  const [notification, setNotification] = useState({ message: null, type: null });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [person, setPerson] = useState(null);
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  // Show a notification message
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  // Fetch persons on component mount
  useEffect(() => {
    const fetchPersons = async () => {
      setLoading(true);
      try {
        const initialPersons = await PersonService.getAll();
        setPersons(initialPersons);
      } catch (error) {
        console.error("Failed to fetch persons:", error);
        showNotification("Failed to load data. Please try again later.", "error");
      } finally {
        setLoading(false);
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

  // Handle edit input changes
  const handleEditInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setEditingPerson((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle search
  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchValue.trim()) {
      showNotification(`Please enter a ${searchType}`, "error");
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchParams = {
        [searchType]: searchValue.trim(),
      };
      const returnedPerson = await PersonService.searchPerson(searchParams);
      
      // Handle both single result and array of results
      if (Array.isArray(returnedPerson)) {
        setSearchResults(returnedPerson);
      } else {
        setSearchResults([returnedPerson]);
      }
      
      setPerson(null);
      showNotification("Search completed successfully", "success");
    } catch (error) {
      console.error("Error searching person:", error);
      showNotification(error.message || "Person not found. Please try again.", "error");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // View person details
  const handleViewPerson = (person) => {
    setPerson(person);
  };

  // Clear search and person details
  const handleClearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setPerson(null);
  };

  // Handle form submission for adding a new person
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const returnedPerson = await PersonService.create({
        name: formData.name.trim(),
        number: formData.number.trim(),
      });

      setPersons((prev) => [...prev, returnedPerson]);
      setFormData({ name: "", number: "" });
      showNotification(`${returnedPerson.name} was added successfully!`, "success");
      setActiveTab("list");
    } catch (error) {
      console.error("Error creating person:", error);
      showNotification(error.message || "Failed to create person. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Start editing a person
  const handleStartEdit = (person) => {
    setEditingPerson({ ...person });
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPerson(null);
    setIsEditing(false);
  };

  // Save edited person
  const handleSaveEdit = async () => {
    if (!editingPerson) return;
    
    setLoading(true);
    try {
      const updatedPerson = await PersonService.update(editingPerson.id, {
        name: editingPerson.name,
        number: editingPerson.number
      });
      
      setPersons(prev => 
        prev.map(p => p.id === updatedPerson.id ? updatedPerson : p)
      );
      
      showNotification(`${updatedPerson.name} was updated successfully!`, "success");
      setIsEditing(false);
      setEditingPerson(null);
      
      // Update person view if the edited person is currently viewed
      if (person && person.id === updatedPerson.id) {
        setPerson(updatedPerson);
      }
      
      // Update search results if needed
      if (searchResults.some(p => p.id === updatedPerson.id)) {
        setSearchResults(prev => 
          prev.map(p => p.id === updatedPerson.id ? updatedPerson : p)
        );
      }
    } catch (error) {
      console.error("Error updating person:", error);
      showNotification(error.message || "Failed to update person. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle person deletion
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    setLoading(true);
    try {
      await PersonService.delete(id);
      setPersons((prev) => prev.filter((person) => person.id !== id));
      setSearchResults((prev) => prev.filter((person) => person.id !== id));
      
      // Clear person view if the deleted person is currently viewed
      if (person && person.id === id) {
        setPerson(null);
      }
      
      showNotification(`${name} was deleted successfully!`, "success");
    } catch (error) {
      console.error("Error deleting person:", error);
      showNotification(error.message || "Failed to delete person. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Header */}
        <div className="app-header">
          <h1 className="app-title">Phonebook App</h1>
        </div>

        {/* Notification */}
        {notification.message && (
          <div
            className={`notification ${
              notification.type === "error"
                ? "notification-error"
                : "notification-success"
            }`}
            role="alert"
          >
            <p>{notification.message}</p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="loading-container">
            <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="loading-text">Loading...</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab ${
              activeTab === "list"
                ? "nav-tab-active"
                : "nav-tab-inactive"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Contacts
          </button>
          <button
            className={`nav-tab ${
              activeTab === "add"
                ? "nav-tab-active"
                : "nav-tab-inactive"
            }`}
            onClick={() => setActiveTab("add")}
          >
            Add Contact
          </button>
          <button
            className={`nav-tab ${
              activeTab === "search"
                ? "nav-tab-active"
                : "nav-tab-inactive"
            }`}
            onClick={() => setActiveTab("search")}
          >
            Search
          </button>
        </div>

        <div className="content-container">
          {/* Add Contact Form */}
          {activeTab === "add" && (
            <div>
              <h2 className="section-title">Add New Contact</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="number" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="number"
                    name="number"
                    type="tel"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 123-456-7890"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? "Saving..." : "Save Contact"}
                </button>
              </form>
            </div>
          )}

          {/* Search Form */}
          {activeTab === "search" && (
            <div>
              <h2 className="section-title">Search Contacts</h2>
              <form onSubmit={handleSearch} className="mb-6">
                <div className="form-row">
                  <div className="md-w-1-3">
                    <label htmlFor="searchType" className="form-label">
                      Search By
                    </label>
                    <select
                      id="searchType"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="form-select"
                    >
                      <option value="id">ID</option>
                      <option value="name">Name</option>
                      <option value="number">Phone Number</option>
                    </select>
                  </div>
                  <div className="md-w-2-3">
                    <label htmlFor="searchValue" className="form-label">
                      Search Value
                    </label>
                    <input
                      id="searchValue"
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="form-input"
                      placeholder={`Enter ${searchType}`}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="btn btn-secondary"
                  >
                    Clear
                  </button>
                </div>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-6">
                  <h3 className="section-subtitle">Search Results</h3>
                  <div className="list-container">
                    <ul className="list">
                      {searchResults.map((p) => (
                        <li key={p.id} className="list-item">
                          <div className="flex items-center">
                            <div className="contact-avatar">
                              <span className="avatar-initial">
                                {p.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="contact-info">
                              <div className="contact-name">{p.name}</div>
                              <div className="contact-number">{p.number}</div>
                            </div>
                          </div>
                          <div className="list-item-actions">
                            <button
                              onClick={() => handleViewPerson(p)}
                              className="btn-action btn-view"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="btn-action btn-edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="btn-action btn-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Person Details */}
              {person && (
                <div className="details-container">
                  <div className="details-header">
                    <h3 className="details-title">Contact Details</h3>
                  </div>
                  <div className="details-content">
                    <dl>
                      <div className="details-row">
                        <dt className="details-label">Full Name</dt>
                        <dd className="details-value">{person.name}</dd>
                      </div>
                      <div className="details-row">
                        <dt className="details-label">Phone Number</dt>
                        <dd className="details-value">{person.number}</dd>
                      </div>
                      <div className="details-row">
                        <dt className="details-label">Contact ID</dt>
                        <dd className="details-value">{person.id}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="details-footer">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(person)}
                      className="btn btn-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(person.id, person.name)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contacts List */}
          {activeTab === "list" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="section-title">My Contacts</h2>
                <span className="badge badge-blue">
                  {persons.length} {persons.length === 1 ? "contact" : "contacts"}
                </span>
              </div>

              {persons.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="empty-title">No contacts</h3>
                  <p className="empty-description">Get started by adding a new contact.</p>
                  <div className="empty-action">
                    <button
                      type="button"
                      onClick={() => setActiveTab("add")}
                      className="btn btn-primary"
                    >
                      Add Contact
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="list-container mb-6">
                    <ul className="list">
                      {persons.map((p) => (
                        <li key={p.id} className="list-item">
                          <div className="flex items-center">
                            <div className="contact-avatar">
                              <span className="avatar-initial">
                                {p.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="contact-info">
                              <div className="contact-name">{p.name}</div>
                              <div className="contact-number">{p.number}</div>
                            </div>
                          </div>
                          <div className="list-item-actions">
                            <button
                              onClick={() => handleViewPerson(p)}
                              className="btn-action btn-view"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="btn-action btn-edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="btn-action btn-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Person Details in Contacts Tab */}
                  {person && (
                    <div className="details-container">
                      <div className="details-header">
                        <h3 className="details-title">Contact Details</h3>
                      </div>
                      <div className="details-content">
                        <dl>
                          <div className="details-row">
                            <dt className="details-label">Full Name</dt>
                            <dd className="details-value">{person.name}</dd>
                          </div>
                          <div className="details-row">
                            <dt className="details-label">Phone Number</dt>
                            <dd className="details-value">{person.number}</dd>
                          </div>
                          <div className="details-row">
                            <dt className="details-label">Contact ID</dt>
                            <dd className="details-value">{person.id}</dd>
                          </div>
                        </dl>
                      </div>
                      <div className="details-footer">
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="btn btn-secondary"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(person)}
                          className="btn btn-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(person.id, person.name)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editingPerson && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Edit Contact</h3>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-name" className="form-label">
                  Name
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  value={editingPerson.name}
                  onChange={handleEditInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-number" className="form-label">
                  Phone Number
                </label>
                <input
                  id="edit-number"
                  name="number"
                  type="tel"
                  value={editingPerson.number}
                  onChange={handleEditInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;