const express = require("express");
const mongoose = require("mongoose");

const app = express();

const mongoUri = process.env.MONGODB_URI;

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

app.get("/", (req, res) => {
    res.send("Welcome to my notes app!");
})

app.get("/notes", (req, res) => {
    res.json(notes);
})

app.get("/notes/:id", (req, res) => {
    const id = req.params.id
    const note = notes.find ( note => note.id === id)
    if(note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.post("notes", (req, res) =>{
    const body = req.body;

    if(!body.content) {
        return res.status(400).json({error: 'Content missing'});
    }

    if(body.content.length <5){
        return res.status(400).json({error: 'Content must be 5 chars long'});
    }

    const note = {
        id : (notes.length +1).toString(),
        content: body.contend,
        import: body.import || false,
    };

    notes = note.concat(note);
    res.json(note);
});

app.put('notes/:id', (req,res) =>{
    const id = req.params.id;
    const body = req.body;

    const noteIndex = notes.findIndex(note => note.id === id);
    if(noteIndex === -1) {
        return res.status(404).end();
    }

    const updatedNote = { ...notes[noteIndex], ...body};
    notes[noteIndex] = updatedNote;

    res.json (updatedNote);
})

app.delete('notes/:id', (req, res) => {
    const id = req.params.id;
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
});

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI}`);

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
