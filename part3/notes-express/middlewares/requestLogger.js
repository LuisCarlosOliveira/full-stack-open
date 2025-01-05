const requestLogger = (req, res, next) => {
  const now = new Date();
  console.log('Timestamp:', now.toISOString());
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('IP:    ', req.ip);
  console.log('---');
  next();
};

module.exports = requestLogger;
