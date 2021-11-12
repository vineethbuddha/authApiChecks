const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./error_handler');

const app = express();
const PORT = 8997;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.options('*', cors());

// Main routes for authentication and authorisation
app.use('/users', routes);
app.use(errorHandler);

app.get('/', function (req, res) {
  res.status(200).json({
    status: 'Success',
    message: 'Hello World, from Auth Api Checker!'
  });
});

app.listen(PORT, () => {
  console.log(`Auth Api Checker listening at http://localhost:${PORT}`);
});

module.exports = app;
