const express = require('express');

const router = express.Router();

let notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

router.get('/', (req, res, next) => {
  try {
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  try {
    const { body } = req;

    if (!body.content) {
      return res.status(400).json({ error: 'Content missing' });
    }

    if (body.content.length < 5) {
      return res
        .status(400)
        .json({ error: 'Content must be at least 5 characters long' });
    }

    const note = {
      id: (notes.length + 1).toString(),
      content: body.content,
      important: body.important || false,
    };

    notes = notes.concat(note);
    res.json(note);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) {
      return res.status(404).send({ error: 'Note not found' });
    }

    const updatedNote = { ...notes[noteIndex], ...body };
    notes[noteIndex] = updatedNote;

    res.json(updatedNote);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    notes = notes.filter((note) => note.id !== id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
