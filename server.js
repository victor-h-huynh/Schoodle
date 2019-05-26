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

app.get("/events", (req, res) => {
  
  res.render("index")

});

app.get("/events/new", (req, res) => {
  
  res.render("events_new")

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
  let timeslot1 = req.body.timeslot1;
  let timeslot2 = req.body.timeslot2;
  let timeslot3 = req.body.timeslot3;

  knex("users")
    .insert({ name, email })
    .returning("id")
    .then((bunchOfIds) => {
      knex("events")
        .insert({ title: event, description, url: shortURL, user_id: bunchOfIds[0] })
        .returning("id")
        .then(eventIds => {
          knex("timeslots")
          .insert({ timeslot: timeslot1, event_id: eventIds[0] })
          .then(result => console.log(result));
          knex("timeslots")
          .insert({ timeslot: timeslot2, event_id: eventIds[0] })
          .then(result => console.log(result));
          knex("timeslots")
          .insert({ timeslot: timeslot3, event_id: eventIds[0] })
          .then(result => console.log(result));
        });
    });

  res.redirect(`http://localhost:8080/events/${shortURL}`);
});


// Event form - enter event info & timeslots
app.get("/events/:id", (req, res) => {
  let templateVars;
  knex('votes')
  .select('votes.id as voteid', 'name', 'email', 'timeslot', 'title', 'description')
  .innerJoin('users', 'votes.user_id', 'users.id')
  .innerJoin('timeslots', 'votes.timeslot_id', 'timeslots.id')
  .innerJoin('events', 'timeslots.event_id', 'events.id')
  // .orderBy('timeslots.id')
  .orderBy('name')
  .then(result => {
    console.log(result)
    const templateVars = {
      shareURL: req.params.id,
      eventTitle: result[0].title,
      eventDescription: result[0].description,
      result: result
    };

    res.render("events_results", templateVars);

  }).catch(err => console.log(err))
  .finally(() => knex.destroy())

});


// Save button actions - allows user to save new vote
app.post("/events/:shareURL", (req, res) => {

  // Save new vote entry to: (a) Users table, (b) Votes table
  // Redirect to same page (reload)

  // let shareURL = req.params.shareURL;
  let shareURL = req.params.shareURL;
  let name1 = req.body.name1;
  let email1 = req.body.email1;
  // let time = (knex('events')
  // .select('id')
  // .innerJoin('timeslots', 'id', 'event_id')
  // .where('url', shareURL))

  // console.log(`PRINT TIME HERE ${time}`);

  knex("users")
    .insert({ name: 'name1', email: 'email1'})
    .returning("id")
    .then(([id]) =>
      result =>{
        console.log('hello')
        res.redirect(`http://localhost:8080/events/${shareURL}`)})


     // knex("events")
     // .insert({ title: event, description, url: shortURL, user_id: id })
     // .then(result => console.log(result));

    
  // knex("users")
  // .insert({ name, email })
  // .returning("id")
  // .then((bunchOfIds) => {
  //   knex("votes")
  //     .insert({
  //       user_id: bunchOfIds[0],
  //       timeslot_id: time
  //         // (knex('events')
  //         //   .select('id')
  //         //   .innerJoin('timeslots', 'id', 'event_id')
  //         //   .where('url', 'shareURL'))
  //     })
  //     .then(result => console.log(result));
  //   })


});


// Edit button actions - allows user to edit existing vote
// app.post("/users/:userid/events/:url", (req, res) => {

//   // Update votes table (in DB) with new availabilities
//   // Redirect to same page (reload)

// });

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});