"use strict";

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require("morgan");
const knexLogger = require("knex-logger");

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "compressed"
  })
);
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
// app.use("/api/events", usersRoutes(knex));
// app.use("/api/timeslots", usersRoutes(knex));
// app.use("/api/attendees", usersRoutes(knex));

//String randomizing function

function generateRandomString() {
  let randomize = Math.random()
    .toString(36)
    .substring(7);
  return randomize;
}

// Home page - redirects (create button) to /events/new
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/events/new", (req, res) => {
  res.render("events_new");
});

// Save new event and redirect to event poll page
app.post("/events/new", (req, res) => {
  // Add new URL and form entries to "event" DB table & "timeslot" DB table
  // Redirect to event page "/events/:url"
  let shortURL = generateRandomString();
  //input parameters
  let name = req.body.name;
  let email = req.body.email;
  let event = req.body.event;
  let description = req.body.description;
  // let timeslot1 = req.body.timeslot1;
  // let timeslot2 = req.body.timeslot2;
  // let timeslot3 = req.body.timeslot3;


  knex("users")
    .insert({ name, email })
    .returning("id")
    .then(([id]) => {
      knex("events")
        .insert({ title: event, description, url: shortURL, user_id: id })
        .then(result => console.log(result));
          // knex("events")
          // .insert({ title: event, description, url: shortURL, user_id: id })
          // .then(result => console.log(result));
    });

  res.redirect(`http://localhost:8080/events/${shortURL}`);
});

app.get("/events/:id", (req, res) => {
  let eventURL = { shareURL: req.params.id };

  res.render("events_results", eventURL);
});

app.get("/u/:shortURL", (req, res) => {
  res.render("events_results");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
