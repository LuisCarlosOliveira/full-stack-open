const errorHandler = (err, req, res) => {
  console.error('Erro detectado:');
  console.error('Mensagem:', err.message);
  console.error('Nome do erro:', err.name);
  console.error('Stack:', err.stack);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'ID wrong format' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  return res.status(500).send({ error: 'Something wrong in the server' });
};

module.exports = errorHandler;
