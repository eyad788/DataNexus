const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

/**
 * GET Request: Render the signup page.
 *
 * - Calls the `user_signup_get` method from `authController`.
 * - This method displays the signup page to the user.
 * - Route: `/` (root path for the signup route).
 */
router.get("", authController.user_signup_get);

/**
 * POST Request: Handle new user signup submission.
 *
 * - First, performs input validation using `express-validator`.
 * - Applies validation rules to ensure the email is in a proper format and that the password meets minimum complexity requirements.
 * - If validation succeeds, calls `user_signup_post` from `authController`.
 * - Route: `/` (root path for the signup route).
 */
router.post(
  "",
  [
    /**
     * Validate Email:
     *
     * - Uses `check` from `express-validator` to validate the email format.
     * - Displays a custom error message if the input is not a valid email.
     */
    check("email", "Please provide a valid email").isEmail(),
    /**
     * Validate Password Complexity:
     *
     * - Ensures that the password is at least 8 characters long.
     * - Requires at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
     * - Uses a regular expression to match the required pattern.
     */
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],

  /**
   * Execute the signup logic after validation.
   *
   * - Calls `user_signup_post` from `authController`.
   * - This method is responsible for creating a new user and handling further processing.
   */
  authController.user_signup_post
);

/**
 * Export the router module.
 *
 * - Makes this router available to be imported in the main app.
 * - The app can use `app.use('/signup', signupRoutes)` to attach these routes to a specific path (e.g., `/signup`).
 */
module.exports = router;
