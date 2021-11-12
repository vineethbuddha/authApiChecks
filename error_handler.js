function errorHandler(err, req, res, next) {
  if (typeof err === 'string') {
    // probably user bad request
    return res.status(400).json({ message: err });
  }

  // jwt middleware threw authentication error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  // otherwise, should be some internal server error
  return res.status(500).json({ message: err.message });
}

module.exports = errorHandler;
