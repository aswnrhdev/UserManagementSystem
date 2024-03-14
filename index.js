// Require the Mongoose library, which helps with MongoDB interactions.
const mongoose = require("mongoose");
// Connect to the MongoDB database located at "mongodb://127.0.0.1:27017/user_management_system".
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

// Import the "nocache" library. It is typically used to disable caching for HTTP responses
const nocache = require("nocache");
const path = require('path');


// Require the Express.js framework, which is used to create web applications in Node.js.
const express = require("express");
// Create an instance of the Express application.
const app = express();


// Using the "nocache" middleware
app.use(nocache());   
app.use(express.static(path.join(__dirname,'src')));
app.use(express.static(path.join(__dirname,'publics')))

// Require the userRoute module from the "./routes/userRoute" file.
const user_route = require("./routes/userRoute");
// Middleware: Use the user_route for routes starting at the root ("/") path.
app.use("/", user_route);


// Require the adminRoute module from the "./routes/adminRoute" file.
const adminRoute = require("./routes/adminRoute");
// Middleware: Use the adminRoute for routes starting at the "/admin" path.
app.use("/admin", adminRoute);


// listen on port 3000.
app.listen(3000, () => {
  console.log(`Server is successfully running. Click here for more info: \x1b[34mhttp://localhost:3000`);
});