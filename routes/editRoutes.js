const express = require("express");
const router = express.Router();
// Import userController to handle user-specific logic and middleware for authentication checks.
const userController = require("../controllers/userController");// User-related controller functions.
const middleware = require("../middleware/middleware"); // Middleware for authentication and user verification.



// GET REQUEST: Retrieve a specific user's details for editing based on their ID.
// - `:id` is a route parameter representing the user ID.
// - The `requireAuth` middleware checks if the user is authenticated before granting access.
// - `user_edit_get` from `userController` is called to handle the GET request logic.
router.get("/:id", middleware.requireAuth, userController.user_edit_get);



// DELETE REQUEST: Remove a user based on their ID.
// - `:id` is a dynamic route parameter representing the user to be deleted.
// - `user_delete` from `userController` is used to handle the deletion of the specified user.
router.delete("/:id", userController.user_delete);



// PUT REQUEST: Update a user's information based on their ID.
// - `:id` is a dynamic parameter representing the user to be updated.
// - `user_update` from `userController` is used to handle the updating logic.
router.put("/:id", userController.user_update);



// Export the router module so that it can be used by the main application file.
// This makes all defined routes accessible when the main app uses this module.
module.exports = router;
