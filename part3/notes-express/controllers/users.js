const express = require('express');

const router = express.Router();
const User = require('../models/user');

// Buscar todos os usuários
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    return next(err);
  }
});

// Criar um novo usuário
router.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name / Email missing' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const user = new User({ name, email });
    const savedUser = await user.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    return next(err);
  }
});

// Buscar usuário por ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.json(user);
    }
    return res.status(404).send({ error: 'User not found' });
  } catch (err) {
    return next(err);
  }
});

// Atualizar usuário por ID
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name / Email missing' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.id !== req.params.id) {
      return res
        .status(400)
        .json({ error: 'Email already in use by another user' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true, context: 'query' },
    );
    if (updatedUser) {
      return res.json(updatedUser);
    }
    return res.status(404).send({ error: 'User not found' });
  } catch (err) {
    return next(err);
  }
});

// Remover usuário por ID
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      return res.status(204).end();
    }
    return res.status(404).send({ error: 'User not found' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
