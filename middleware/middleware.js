const jwt = require("jsonwebtoken"); // JWT library for token verification.
const AuthUser = require("../models/authUser"); // Mongoose model for authenticated users.

// Middleware to ensure user is authenticated before allowing access to protected routes.
const requireAuth = function (req, res, next) {
  token = req.cookies.jwt;

  if (token) {
    // Verify the token using the secret key.
    jwt.verify(token, "DataNexus", (err) => {
      if (err) {
        // If token verification fails, redirect to login page.
        res.redirect("/login");
      } else {
        // If token is valid, allow the request to proceed to the next middleware or route handler.
        next();
      }
    });
  } else {
    // If no token is present, redirect to the login page.
    res.redirect("/login");
  }
};

// Middleware to check if a user is logged in and set the user details in the response's locals.
const checkIfUser = function (req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    // Verify the token using the secret key stored in environment variables.
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        // If token verification fails, set `res.locals.user` to `null`.
        res.locals.user = null;
        next(); // Proceed to the next middleware or route handler.
      } else {
        // If token is valid, find the authenticated user in the database using the decoded ID.
        const loginUser = await AuthUser.findOne({ _id: decoded.id });
        // Store the user information in `res.locals.user` to make it accessible in views.
        res.locals.user = loginUser;
        next(); // Proceed to the next middleware or route handler.
      }
    });
  } else {
    // If no token is present, set `res.locals.user` to `null`.
    res.locals.user = null;
    next();
  }
};

// Export the middleware functions for use in routing.
module.exports = { requireAuth, checkIfUser };
