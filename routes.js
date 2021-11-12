// Initialize express router
let router = require('express').Router();

// Import controllers
const authController = require('./controller/auth_controller');
const roles = require('./roles');

// ================ Main routes ============================

// No authentication required -> all requesters are allowed to attempt to login
router.route('/login').post(authController.handleLogin);

// Any authenticated user can access this route to get user information
// authenticate first, then pass control to next handler
router.get('/:id', authController.authorise(), authController.getUserById);

// Only users with admin rights can get all user information
// authorise first, then pass control to next handler
router.get('/', authController.authorise(roles.Admin), authController.getAllUsers);

// Export API routes
module.exports = router;
