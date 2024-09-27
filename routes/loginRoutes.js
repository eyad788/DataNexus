const express = require("express");
const router = express.Router();

// Import the authentication controller to handle user authentication-related logic.
const authController = require("../controllers/authController"); // Auth-related controller functions.

/**
 * GET Request: Render the login page.
 *
 * - Calls the `user_login_get` method from the `authController`.
 * - This method is responsible for displaying the login page to the user.
 * - Route: `/` (root path)
 */
router.get("", authController.user_login_get);

/**
 * POST Request: Handle user login submission.
 *
 * - Calls the `user_login_post` method from the `authController`.
 * - This method is responsible for authenticating the user based on the submitted login credentials.
 * - Route: `/` (root path)
 */
router.post("", authController.user_login_post);

/**
 * Export the router module.
 *
 * - This allows the main app to access the defined routes.
 * - The app can use `app.use('/login', loginRoutes)` to attach these routes to a specific path (e.g., `/login`).
 */
module.exports = router;
