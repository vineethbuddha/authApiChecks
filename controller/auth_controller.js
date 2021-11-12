const jwt = require('express-jwt');
const { secret } = require('./jwtSecret.json');
const roles = require('../roles');

const userService = require('./service');

exports.handleLogin = (req, res, next) => {
  console.log(`reached login for : ${req.body?.username}`);
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res
            .status(403)
            .json({ message: 'You have provided either incorrect username or password' })
    )
    .catch(err => next(err));
};

exports.getAllUsers = (req, res, next) => {
  console.log('reached get all users');
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
};

exports.getUserById = (req, res, next) => {
  console.log(`reached get users by id: ${req.params.id}`);
  const currentUser = req.user;
  const id = parseInt(req.params.id);

  // only allow admins to access other user records
  if (id !== currentUser.sub && currentUser.role !== roles.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  userService
    .getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
};

exports.authorise = (roles = []) => {
  // if just one role supplied, could be string type,
  if (typeof roles === 'string') {
    // convert to array for further processing
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)

    jwt({ secret, algorithms: ['HS256'] }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // authentication and authorization successful
      next();
    }
  ];
};
