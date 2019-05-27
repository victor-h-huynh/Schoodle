exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('timeslots').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('timeslots').insert({id: 1, timeslot: 'June 3rd @ 4pm', event_id: '1'}),
        knex('timeslots').insert({id: 2, timeslot: 'June 5rd @ 4pm', event_id: '1'}),
        knex('timeslots').insert({id: 3, timeslot: 'June 7th @ 8pm', event_id: '1'}),
        knex('timeslots').insert({id: 4, timeslot: 'August 7th @ 8pm', event_id: '2'}),
        knex('timeslots').insert({id: 5, timeslot: 'August 12th @ 8pm', event_id: '2'}),
        knex('timeslots').insert({id: 6, timeslot: 'August 14th @ 8pm', event_id: '2'}),
        knex('timeslots').insert({id: 7, timeslot: 'August 20th @ 8pm', event_id: '2'})
      ]);
    });
};