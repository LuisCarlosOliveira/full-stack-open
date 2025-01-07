import { useState, useEffect } from 'react';
import notesService from './services/notes';
//import usersService from './services/users'
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [importantNotes, setImportantNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [searchId, setSearchId] = useState('');
  const [noteById, setNoteById] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    notesService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes);
      })
      .catch(error => {
        console.error('Erro ao buscar todas as notas:', error);
        setErrorMessage('Não foi possível buscar as notas. Tente novamente mais tarde.');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });

    notesService
      .getImportants()
      .then(initialImportantNotes => {
        setImportantNotes(initialImportantNotes);
      })
      .catch(error => {
        console.error('Erro ao buscar notas importantes:', error);
        setErrorMessage('Não foi possível buscar as notas importantes. Tente novamente mais tarde.');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    notesService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        if (returnedNote.important) {
          setImportantNotes(importantNotes.concat(returnedNote));
        }
        setNewNote('');
      })
      .catch(error => {
        console.error('Erro ao adicionar nota:', error);
        setErrorMessage('Não foi possível adicionar a nota. Verifique os dados e tente novamente.');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const removeNote = (id) => {
    if (window.confirm('Tem certeza que deseja remover esta nota?')) {
      notesService
        .remove(id)
        .then(() => {
          setNotes(notes.filter(note => note.id !== id));
          setImportantNotes(importantNotes.filter(note => note.id !== id));
        })
        .catch(error => {
          console.error('Erro ao remover nota:', error);
          setErrorMessage('Não foi possível remover a nota. Tente novamente mais tarde.');
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const getNoteById = () => {
    if (!searchId) {
      setErrorMessage('Por favor, insira um ID válido.');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }

    notesService
      .getById(searchId)
      .then(note => {
        setNoteById(note);
      })
      .catch(error => {
        console.error('Erro ao buscar a nota por ID:', error);
        setErrorMessage('Não foi possível buscar a nota. Verifique o ID e tente novamente.');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const handleSearchIdChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  return (
    <div>
      <h1>Notes Management</h1>

      {errorMessage && <div className="error">{errorMessage}</div>}

      <form onSubmit={addNote}>
        <input 
          type="text" 
          value={newNote} 
          onChange={handleNoteChange} 
          placeholder="New Note" 
        />
        <button type="submit">Add</button>
      </form>

      <h2>All Notes</h2>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content} {note.important ? <strong>(Important)</strong> : ''}
            <button onClick={() => removeNote(note.id)}>Remove</button>
          </li>
        )}
      </ul>

      <h2>Important Notes</h2>
      <ul>
        {importantNotes.map(note => 
          <li key={note.id}>
            {note.content}
            <button onClick={() => removeNote(note.id)}>Remove</button>
          </li>
        )}
      </ul>

      <h2>Get Note by ID</h2>
      <form onSubmit={(event) => { event.preventDefault(); getNoteById(); }}>
        <input 
          type="text" 
          value={searchId} 
          onChange={handleSearchIdChange} 
          placeholder="Insert note ID" 
        />
        <button type="submit">Find</button>
      </form>

      {noteById && (
        <div>
          <h3>Note Founded:</h3>
          <p>{noteById.content} {noteById.important ? <strong>(Important)</strong> : ''}</p>
        </div>
      )}
    </div>
  );
};

export default App;
