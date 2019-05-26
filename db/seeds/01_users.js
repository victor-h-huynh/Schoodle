exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Alice Doe', email: 'alice.doe@gmail.com'}),
        knex('users').insert({id: 2, name: 'Bob Brown', email: 'bob.brown@gmail.com'}),
        knex('users').insert({id: 3, name: 'Charlie Fairchild', email: 'charlie.fairchild@gmail.com'}),
        knex('users').insert({id: 4, name: 'Jessie Fairchild', email: 'jessiefairchild02@gmail.com'})
      ]);
    });
};