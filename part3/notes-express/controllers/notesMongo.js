const express = require("express");
const router = express.Router();

const Note = require("../models/note");

router.get("/", async (req, res, next) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

router.get("/importants", async (req, res, next) => {
  try {
    const importantNotes = await Note.find({ important: true });
    res.json(importantNotes);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { content, important } = req.body;

    if (!content || content.length < 5) {
      return res
        .status(400)
        .json({ error: "Content must be at least 5 characters long" });
    }

    const note = new Note({ content, important });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).send({ error: "Note not found" });
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { content, important } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { content, important },
      { new: true, runValidators: true, context: "query" }
    );

    if (updatedNote) {
      res.json(updatedNote);
    } else {
      res.status(404).send({ error: "Note not found" });
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (deletedNote) {
      res.status(204).end();
    } else {
      res.status(404).send({ error: "Note not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
