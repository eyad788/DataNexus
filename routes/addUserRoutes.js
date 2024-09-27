const express = require("express"); // Express framework for creating routes.
const router = express.Router(); // Create a new instance of Express Router to define routes.
const userController = require("../controllers/userController"); // Import the user controller which contains the logic for handling user-related actions.
const middleware = require("../middleware/middleware"); // Import middleware for route protection and user verification.

// Define a GET request route for adding a new user.
// - The `requireAuth` middleware is applied to ensure only authenticated users can access this route.
// - `user_add_get` is the controller function responsible for rendering the 'Add User' page.
router.get("", middleware.requireAuth, userController.user_add_get);

// Define a POST request route for submitting new user data.
// - The `user_post` function in the `userController` handles this request by saving the new user information to the database.
router.post("", userController.user_post);

// Export the router module for use in the main application.
// This will allow the defined routes to be accessed when the main app uses this module.
module.exports = router;
