// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { getTasks, addTask, deleteTask } from './services/tasks';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (task) => {
    try {
      const novaTarefa = await addTask(task);
      setTasks([novaTarefa, ...tasks]);
    } catch (err) {
      setError('Error adding task.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Error deleting task');
    }
  };

  return (
    <div className="container">
      <h1>Task List</h1>
      <TaskForm onAdd={handleAddTask} />
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <TaskList tasks={tasks} onDelete={handleDeleteTask} />
      )}
    </div>
  );
};

export default App;
