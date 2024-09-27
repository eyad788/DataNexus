// Load environment variables from a `.env` file into `process.env`
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Fallback to port 3000 if PORT is not defined in `.env`
const mongoose = require("mongoose");

// Middleware for parsing request bodies and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Set the view engine to EJS for rendering templates
app.set("view engine", "ejs");
// Serve static files (CSS, JS, images) from the "public" directory
app.use(express.static("public"));

// Middleware to allow HTTP methods such as PUT or DELETE in places where the client doesn't support it
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Routes
const allRoutes = require("./routes/allRoutes");
const addUserRoutes = require("./routes/addUserRoutes");
const editUserRoutes = require("./routes/editRoutes");
const signupRoutes = require("./routes/signupRoutes");
const loginRoutes = require("./routes/loginRoutes");

// Middleware to parse cookies from incoming requests
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Auto-refresh during development using `livereload` and `connect-livereload`
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// MongoDB Connection Setup
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//  All Routes
app.use(allRoutes);
app.use("/user/add.html", addUserRoutes); // Updated to avoid `.html` extension in routes
app.use("/edit", editUserRoutes);
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
