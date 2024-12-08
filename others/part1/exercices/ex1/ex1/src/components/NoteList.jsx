import React, { useState } from 'react';

const initialNotes = [
  { id: 1, titulo: 'Nota 1', conteudo: 'Conteúdo da nota 1' },
  { id: 2, titulo: 'Nota 2', conteudo: 'Conteúdo da nota 2' },
  { id: 3, titulo: 'Nota 3', conteudo: 'Conteúdo da nota 3' },
];

function NoteList() {
    const [notes, setNotes] = useState(initialNotes);
    
    const deleteNote = (id) => {
        setNotes(notes.filter((note) => note.id !== id));
    };

    return(
        <>
        <h1>Notes List</h1>
        {notes.map((note) => (
            <div key={note.id}>
                <p>{note.titulo}</p>
                <p>{note.conteudo}</p>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
            </div>
        ))}
        </>
    )
}

export default NoteList;