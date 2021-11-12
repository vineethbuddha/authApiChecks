const { secret } = require('./jwtSecret.json');
const jwt = require('jsonwebtoken');
const roles = require('../roles');

// Mock user data objects
const users = [
  {
    id: 1,
    username: 'vineethbuddha',
    password: 'password',
    role: roles.Admin
  },
  {
    id: 2,
    username: 'normalUser',
    password: 'password',
    role: roles.User
  }
];

// used for login -> generates JWT
async function authenticate({ username, password }) {
  // ensures password and username match
  const user = users.find(user => user.username === username && user.password === password);

  // only truthy if match exists, otherwise return void
  if (user) {
    const token = jwt.sign({ sub: user.id, role: user.role }, secret);
    const { password, ...userObjectNoPassword } = user;
    return {
      ...userObjectNoPassword,
      token
    };
  }
}

async function getById(id) {
  const user = users.find(userObj => userObj.id === parseInt(id));
  if (!user) return;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function getAll() {
  console.log('hello');
  return users.map(userObj => {
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  });
}

module.exports = {
  authenticate,
  getAll,
  getById
};
