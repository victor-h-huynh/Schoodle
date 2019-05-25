exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("events")
    .del()
    .then(function() {
      return Promise.all([
        // Inserts seed entries
        knex("events").insert({
          id: 1,
          title: "Lighthouse Reunion",
          description:
            "2019 LHL cohort reunites to share first year experiences!",
          url: "488b034b9f",
          user_id: 2
        }),
        knex("events").insert({
          id: 2,
          title: "5-a-7 NDG Crew",
          description: "Neighbourhood crew catch-up",
          url: "15e795526e",
          user_id: 2
        }),
        knex("events").insert({
          id: 3,
          title: "Girls' Brunch!",
          description: "McGill ladies finally meet up!",
          url: "7f921cfb4e",
          user_id: 2
        })
      ]);
    });
};