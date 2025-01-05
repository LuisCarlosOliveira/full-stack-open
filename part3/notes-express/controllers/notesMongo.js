const express = require('express');

const router = express.Router();
const Note = require('../models/note');

router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find({});
    return res.json(notes);
  } catch (err) {
    return next(err);
  }
});

router.get('/importants', async (req, res, next) => {
  try {
    const importantNotes = await Note.find({ important: true });
    return res.json(importantNotes);
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { content, important } = req.body;
    if (!content || content.length < 5) {
      return res
        .status(400)
        .json({ error: 'Content must be at least 5 characters long' });
    }
    const note = new Note({ content, important });
    const savedNote = await note.save();
    return res.status(201).json(savedNote);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      return res.json(note);
    }
    return res.status(404).send({ error: 'Note not found' });
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { content, important } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { content, important },
      { new: true, runValidators: true, context: 'query' },
    );
    if (updatedNote) {
      return res.json(updatedNote);
    }
    return res.status(404).send({ error: 'Note not found' });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (deletedNote) {
      return res.status(204).end();
    }
    return res.status(404).send({ error: 'Note not found' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
