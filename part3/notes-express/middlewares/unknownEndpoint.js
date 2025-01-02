const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Endpoint desconhecido" });
};

module.exports = unknownEndpoint;
