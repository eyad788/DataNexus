// Import necessary libraries and modules.
const express = require("express"); // Express framework to manage routing.
const router = express.Router(); // Create a new instance of the Express Router.
const userController = require("../controllers/userController"); // Controller for handling user-related logic.
const middleware = require("../middleware/middleware"); // Middleware for authentication and user checks.
const authController = require("../controllers/authController"); // Controller for handling authentication-related logic.
const multer = require("multer"); // Multer library for handling file uploads.

// Configure Multer for file uploads.
// - `storage: multer.diskStorage({})` sets up the storage mechanism, which can be customized to specify file destinations and names.
const upload = multer({ storage: multer.diskStorage({}) });

// Middleware: Apply `checkIfUser` to all routes.
// - `*` is a wildcard that matches all GET and POST requests.
// - `checkIfUser` middleware checks if a user is logged in and sets `res.locals.user` to the current user if authenticated.
router.get("*", middleware.checkIfUser);
router.post("*", middleware.checkIfUser);

// Route for user signout.
// - Uses `user_signout_get` from `authController` to handle user signout logic, such as clearing JWT tokens.
router.get("/signout", authController.user_signout_get);

// Root route ("/") for rendering the welcome page.
// - `user_welcome_get` from `userController` displays a welcome page for new or unregistered users.
router.get("/", userController.user_welcome_get);

// Home page route ("/home") for authenticated users.
// - `requireAuth` middleware is applied to ensure that only authenticated users can access this route.
// - `user_index_get` from `userController` is used to render the user's home page, typically showing user-specific data.
router.get("/home", middleware.requireAuth, userController.user_index_get);

// View route ("/view/:id") to view a specific user's details based on their unique ID.
// - The `requireAuth` middleware ensures only authenticated users can view the details.
// - `user_view_get` from `userController` is called to retrieve and display user-specific information.
router.get("/view/:id", middleware.requireAuth, userController.user_view_get);

// Search route ("/search") to search for users in the database.
// - `user_search_post` handles POST requests and retrieves matching users based on the search criteria.
router.post("/search", userController.user_search_post);

// Profile update route ("/update-profile") for uploading and updating user profile images.
// - `upload.single("avatar")` is a multer middleware that processes single file uploads with the field name 'avatar'.
// - `user_image_post` handles the image upload and update logic.
router.post(
  "/update-profile",
  upload.single("avatar"),
  userController.user_image_post
);

// Export the router module so that it can be used in the main application file.
// This will make all defined routes accessible when the main app uses this module.
module.exports = router;
