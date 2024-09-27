const mongoose = require("mongoose"); // Mongoose library for MongoDB operations.
const Schema = mongoose.Schema; // Schema constructor for defining the structure of MongoDB collections.
const bcrypt = require("bcrypt"); // Library for password hashing.

// Define the structure of the `AuthUser` collection using a Mongoose schema.
const authUserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  customerInfo: [
    {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
      age: Number,
      country: String,
      gender: String,
      createdAt: Date, // Date when the customer record was created.
      updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update (default is current date).
    },
  ],
  profileImage: String, // URL for the user's profile image stored in Cloudinary.
});

// `pre` middleware to hash the password before saving the document to the database.
authUserSchema.pre("save", async function (next) {
  // Generate a salt using bcrypt (this creates a random string for security).
  const salt = await bcrypt.genSalt();
  // Hash the user's password using the generated salt.
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create a Mongoose model called `AuthUser` using the `authUserSchema` definition.
// This model will be used to interact with the `users` collection in MongoDB.
const AuthUser = mongoose.model("User", authUserSchema);

// Export the model for use in other parts of the application.
module.exports = AuthUser;
