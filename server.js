// load .env data into process.env
require("dotenv").config();


// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");
const checkoutRoutes = require("./routes/checkout"); //Keep it for now but need to be deleted
const rootRoutes = require("./routes/root");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");
const vendorsRoutes = require("./routes/vendors");
const statusRoutes = require("./routes/status");


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
app.use("/checkout", checkoutRoutes(db)); //Keep it for now but need to be deleted
app.use("/cart", cartRoutes(db));
app.use("/orders", ordersRoutes(db));
app.use("/vendors", vendorsRoutes(db));
app.use("/", rootRoutes(db));
app.use("/status", statusRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
