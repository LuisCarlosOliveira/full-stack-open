const express = require("express");
const app = express();

app.use(express.json());

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

app.get("/", (request, response) => {
  response.send("<h1> Hello World! </h1>");
});

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

    const newNote = {
      id: (notes.length + 1).toString(),
      content: content.trim(),
      important,
    };

    notes = notes.concat(newNote);

    console.log("Note created:", newNote);

    return response.status(201).json(newNote);
  } catch (error) {
    console.error("Error:", error);
    return response.status(500).json({
      error: "something went wrong",
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express Server running at: http://localhost:${PORT}`);
});
