const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const unknownEndpoint = require('./middlewares/unknownEndpoint');

const notesRouter = require('./controllers/notes');
const notesMongoRouter = require('./controllers/notesMongo');
const userRouter = require('./controllers/users');

const app = express();

const mongoUri = process.env.MONGODB_URI;

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/notesMongo', notesMongoRouter);
app.use('/api/users', userRouter);

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
