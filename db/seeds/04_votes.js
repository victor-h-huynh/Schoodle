exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('votes').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('votes').insert({id: 1, user_id: '1', timeslot_id: '1'}),
        knex('votes').insert({id: 2, user_id: '2', timeslot_id: '2'}),
        knex('votes').insert({id: 3, user_id: '3', timeslot_id: '3'}),
        knex('votes').insert({id: 4, user_id: '1', timeslot_id: '4'}),
        knex('votes').insert({id: 5, user_id: '4', timeslot_id: '5'}),
        knex('votes').insert({id: 6, user_id: '2', timeslot_id: '6'}),
        knex('votes').insert({id: 7, user_id: '3', timeslot_id: '7'})
      ]);
    });
};