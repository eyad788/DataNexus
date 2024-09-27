const AuthUser = require("../models/authUser"); // Mongoose model for user authentication and customer information.
var moment = require("moment"); // Import moment.js for date formatting and manipulation.
const jwt = require("jsonwebtoken"); // JWT library for creating and verifying user tokens.
const cloudinary = require("cloudinary").v2; // Cloudinary library for image upload and storage.
require("dotenv").config(); // Load environment variables from .env file.

// Configure Cloudinary with credentials from environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// GET handler for displaying the welcome page.
const user_welcome_get = (req, res) => {
  res.render("welcome"); // Render the welcome view.
};

// GET handler for displaying the page to add new user/customer information.
const user_add_get = (req, res) => {
  res.render("user/add"); // Render the 'add user' form view.
};

// POST handler for adding a new customer to the authenticated user's list.
const user_post = (req, res) => {
  const token = req.cookies.jwt; // Retrieve JWT token from cookies.
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Decode JWT to get the user's ID.

  // Update the authenticated user's document by pushing the new customer information.
  AuthUser.updateOne(
    { _id: decoded.id },
    {
      $push: {
        customerInfo: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          age: req.body.age,
          country: req.body.country,
          gender: req.body.gender,
          createdAt: new Date(),
        },
      },
    }
  )
    .then(() => {
      res.redirect("/home"); // Redirect to the home page after successful addition.
    })
    .catch((err) => {
      console.log(err); // Log any errors encountered.
    });
};

// GET handler to display all customers for the authenticated user.
const user_index_get = (req, res) => {
  // result ==> array of objects
  const token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Find the user and get their customer information.
  AuthUser.findOne({ _id: decoded.id })
    .then((result) => {
      res.render("index", { obj: result, moment: moment }); // Render the index view with user data and moment for date formatting.
    })
    .catch((err) => {
      console.log(err); // Log any errors encountered.
    });
};

// GET handler for viewing a specific customer's details.
const user_view_get = (req, res) => {
  // Find the user by searching for the specific customer ID in their customerInfo array.
  AuthUser.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      // Locate the specific customer object using the ID parameter.
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });
      res.render("user/view", {
        obj: clickedObject, // Pass the specific customer data to the view.
        moment: moment, // Include moment for date formatting.
      });
    })
    .catch((err) => {
      console.log(err); // Log any errors encountered.
    });
};

// POST handler for searching customers by first name or last name.
const user_search_post = (req, res) => {
  const searchText = req.body.searchText.trim(); // Get and trim the search text input.
  token = req.cookies.jwt; // Retrieve JWT token from cookies.
  decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Decode the token to get the user's ID.

  // Find the authenticated user and search for customers matching the search text.
  AuthUser.findOne({ _id: decoded.id })
    .then((result) => {
      // Filter customerInfo to find matches for the first or last name.
      const searchCustomers = result.customerInfo.filter((item) => {
        return item.firstName === searchText || item.lastName === searchText;
      });
      res.render("user/search", { arr: searchCustomers, moment: moment }); // Render the search results.
    })
    .catch((err) => {
      console.log(err); // Log any errors encountered.
    });
};

// GET handler for displaying the edit page for a specific customer.
const user_edit_get = (req, res) => {
  // Find the user by the specific customer ID in the customerInfo array.
  AuthUser.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      // Locate the specific customer object using the ID parameter.
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });
      res.render("user/edit", {
        obj: clickedObject, // Pass the customer data to the edit view.
        moment: moment, // Include moment for date formatting.
      });
    })
    .catch((err) => {
      console.log(err); // Log any errors encountered.
    });
};

// DELETE handler for removing a specific customer from the list.
const user_delete = (req, res) => {
  const token = req.cookies.jwt; // Retrieve JWT token from cookies.
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Decode the token to get the user's ID.

  // Remove the specific customer from the authenticated user's document.
  AuthUser.updateOne(
    { "customerInfo._id": req.params.id },
    { $pull: { customerInfo: { _id: req.params.id } } }
  )
    .then((result) => {
      console.log(result); // Log the result of the deletion.
      res.redirect("/home"); // Redirect to the home page after deletion.
    })
    .catch((err) => {
      console.log(err); // Log any errors encountered.
    });
};

// PUT handler for updating a specific customer's details.
const user_update = (req, res) => {
  // Update the specific customer's details in the authenticated user's document.
  AuthUser.updateOne(
    { "customerInfo._id": req.params.id },
    {
      "customerInfo.$.firstName": req.body.firstName,
      "customerInfo.$.lastName": req.body.lastName,
      "customerInfo.$.email": req.body.email,
      "customerInfo.$.phoneNumber": req.body.phoneNumber,
      "customerInfo.$.age": req.body.age,
      "customerInfo.$.country": req.body.country,
      "customerInfo.$.gender": req.body.gender,
      "customerInfo.$.updatedAt": new Date(),
    }
  )
    .then((result) => {
      res.redirect("/home"); // Redirect to the home page after updating.
    })
    .catch((err) => {
      console.log(err); // Log any errors encountered.
    });
};

// POST handler for uploading a profile image to Cloudinary.
const user_image_post = function (req, res, next) {
  cloudinary.uploader.upload(
    req.file.path,
    { folder: "DataNexus/Profile-Image" }, // Specify the folder path in Cloudinary.
    async (error, result) => {
      if (result) {
        token = req.cookies.jwt; // Retrieve JWT token from cookies.
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Decode the token to get the user's ID.

        // Update the user's profile image URL in the database.
        const avatar = await AuthUser.updateOne(
          { _id: decoded.id },
          { profileImage: result.secure_url }
        );
        res.redirect("/home"); // Redirect to the home page after updating the profile image.
      }
    }
  );
};

// Export the controller methods for use in routing.
module.exports = {
  user_add_get,
  user_post,
  user_index_get,
  user_view_get,
  user_search_post,
  user_edit_get,
  user_delete,
  user_update,
  user_welcome_get,
  user_image_post,
};
