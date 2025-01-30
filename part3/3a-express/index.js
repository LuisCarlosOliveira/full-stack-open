const express = require("express");
const cors = require('cors'); 
const app = express();

app.use(cors());

/*
app.use(cors({
  origin: 'http://localhost:5173' // only this origin
}));
*/

app.use(express.static('dist'));

app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};
app.use(requestLogger);

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

/*
app.get("/", (request, response) => {
  response.send("<h1> Hello World! </h1>");
});
*/

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const { id } = request.params; //Destructuring

  if (!id) {
    return response.status(400).json({
      error: "Missing note id",
      status: 400,
    });
  }

  const note = notes.find((note) => note.id === id);

  if (!note) {
    return response.status(404).json({
      error: "Note not found",
      requestedId: id,
      status: 404,
    });
  }

  return response.json(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const { id } = request.params; //Destructuring

  const noteToDelete = notes.find((note) => note.id === id);
  if (!noteToDelete) {
    return response.status(404).json({
      error: "Note not found",
      requestedId: id,
    });
  }

  const initialLength = notes.length;
  notes = notes.filter((note) => note.id !== id);

  if (notes.length === initialLength) {
    return response.status(500).json({
      error: "Failed to delete note",
      requestedId: id,
    });
  }

  console.log(`Note ${id} deleted successfully`);

  return response.status(204).end();
});

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/notes", (request, response) => {
  try {
    const { content, important = false } = request.body;

    if (!content) {
      return response.status(400).json({
        error: "content missing",
      });
    }

    if (typeof content !== "string") {
      return response.status(400).json({
        error: "content must be text",
      });
    }

    if (typeof important !== "boolean") {
      return response.status(400).json({
        error: "important must be true or false",
      });
    }

    const note = {
      content: content.trim(),
      important,
      id: generateId(),
    };

    notes = notes.concat(note);
    console.log("Note created:", note);
    return response.status(201).json(note);
  } catch (error) {
    console.error("Error:", error);
    return response.status(500).json({
      error: "something went wrong",
    });
  }
});

app.put("/api/notes/:id", (request, response) => {
  const { id } = request.params;
  const { content, important } = request.body;

  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    return response.status(404).json({
      error: "Note not found",
      requestedId: id,
    });
  }

  const updatedNote = {
    ...notes[noteIndex],
    content: content || notes[noteIndex].content,
    important: important !== undefined ? important : notes[noteIndex].important,
  };

  notes[noteIndex] = updatedNote;

  return response.json(updatedNote);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express Server running at: http://localhost:${PORT}`);
});
