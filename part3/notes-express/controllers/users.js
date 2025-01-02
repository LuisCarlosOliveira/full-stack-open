const express = require("express");
const router = express.Router();

const User = require("../models/user");

// Buscar todos os usuários
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Criar um novo usuário
router.post("/", async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name / Email missing" });
    }

    const user = new User({ name, email });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

// Buscar usuário por ID
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

// Atualizar usuário por ID
router.put("/:id", async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true, context: "query" }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

// Remover usuário por ID
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(204).end();
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
