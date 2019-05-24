"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'compressed'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
// app.use("/api/events", usersRoutes(knex));
// app.use("/api/timeslots", usersRoutes(knex));
// app.use("/api/attendees", usersRoutes(knex));

//Function to generate URL ID
const generateRandomString = function() {

  return Math.floor((1 + Math.random()) * 0x10000000000).toString(16).substring(1);

}

// Homepage - contains "create button" that redirects to "/events/new" endpoint
app.get("/", (req, res) => {
  res.render("index");
});


// Event form - enter event info & timeslots
app.get("/events/new", (req, res) => {


  // remove this from here, when have access to vic's new page
  let templateVars = { user:
    knex
    .select('user[0].name')
    .from('users')
    .then(res => console.log(res))
    .catch(err => console.log(err))
    .finally(() => knex.destroy())
  };
  
  console.log(templateVars);

  res.render("events_new", templateVars);
});


// Save new event and redirect to event poll page
app.post("/events", (req, res) => {
  
  // Generate new URL
  // Add new URL and form entries to "event" DB table & "timeslot" DB table
  // Redirect to event page "/events/:url"

  res.redirect("/events/:url"); //redirect to the newly created URL

});


// Event page - contains poll table with "save" and "edit" buttons
app.get("/events/:url", (req, res) => {

  // Display new URL as "share" link
  // Populate events table:
    // Add event info from "events" table
    // Add timeslot info from "timeslot" table
    // Check if any votes, if yes add to page
  // Display the editable "vote" row & "edit" button next to each vote

  res.render("events_id"); // update with Victor's ejs page name
});


// Save button actions - allows user to save new vote
app.post("/events/:url", (req, res) => {

  // Save new vote entry to:
    // Votes table
    // Users table
  // Redirect to same page (reload)

});


// Edit button actions - allows user to edit existing vote
app.post("/users/:userid/events/:url", (req, res) => {

  // Update votes table (in DB) with new availabilities
  // Redirect to same page (reload)

});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
