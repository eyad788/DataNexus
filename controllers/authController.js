const AuthUser = require("../models/authUser"); // Import the AuthUser model to interact with the user database.
const jwt = require("jsonwebtoken"); // Import the JWT library to create and verify tokens for user sessions.
const { validationResult } = require("express-validator"); // Import the validationResult function to handle validation errors.
const bcrypt = require("bcrypt"); // Import bcrypt for secure password hashing and comparison.

// GET handler for displaying the login page.
const user_login_get = (req, res) => {
  res.render("auth/login"); // Render the login view.
};

// GET handler for displaying the signup page.
const user_signup_get = (req, res) => {
  res.render("auth/signup"); // Render the signup view.
};

// GET handler for logging out the user.
const user_signout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 }); // Clear the 'jwt' cookie by setting it to an empty value with a very short lifespan.
  res.redirect("/"); // Redirect to the home page after logging out.
};

// POST handler for creating a new user during the signup process.
const user_signup_post = async (req, res) => {
  try {
    // check Validation (email & password)
    const objError = validationResult(req);
    if (objError.errors.length > 0) {
      // If validation errors exist, return them as a JSON response.
      return res.json({
        arrValidationError: objError.errors,
      });
    }

    // Check if the email already exists in the database.
    const isCurrentEmail = await AuthUser.findOne({ email: req.body.email });
    if (isCurrentEmail) {
      // If the email is already registered, notify the client.
      return res.json({ existEmail: "Email already exist" });
    }

    // Create a new user in the database using the data from the request body.
    const newUser = await AuthUser.create(req.body);

    // Generate a JWT token for the newly created user.
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);

    // Set the JWT token in a cookie for client authentication.
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });

    // Return the new user's ID as a JSON response.
    res.json({ id: newUser._id });
  } catch (err) {
    // Catch any unexpected errors and log them.
    console.log(err);
  }
};

// POST handler for authenticating a user during the login process.
const user_login_post = async (req, res) => {
  // Find the user in the database by their email address.
  const loginUser = await AuthUser.findOne({ email: req.body.email });

  try {
    if (loginUser !== null) {
      // If the user is found, compare the plaintext password with the hashed password in the database.
      const match = await bcrypt.compare(req.body.password, loginUser.password);

      if (match) {
        // If the passwords match, generate a JWT token for the user.
        const token = jwt.sign(
          { id: loginUser._id },
          process.env.JWT_SECRET_KEY
        );

        // Set the JWT token in a cookie for client authentication.
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });

        // Return the user's ID as a JSON response.
        res.json({ id: loginUser._id });
      } else {
        // If the passwords do not match, notify the client.
        res.json({
          wrongPassword: `Incorrect Password for ${loginUser.email}`,
        });
      }
    } else {
      // If the email is not found in the database, notify the client.
      res.json({ notRegistered: "Email not found, try to sign up" });
    }
  } catch (err) {
    // Catch any unexpected errors and log them.
    console.log(err);
  }
};

// Export all the controller methods for use in the routing modules.
module.exports = {
  user_signout_get,
  user_signup_post,
  user_login_post,
  user_login_get,
  user_signup_get,
};
