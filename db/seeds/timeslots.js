
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('timeslots').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('timeslots').insert({id: 1, timeslot: 'Monday June 3rd @ 4pm', event_id: '1'}),
        knex('timeslots').insert({id: 2, timeslot: 'Wednesday June 5rd @ 4pm', event_id: '1'}),
        knex('timeslots').insert({id: 3, timeslot: 'Friday June 7rd @ 8pm', event_id: '1'})
      ]);
    });
};