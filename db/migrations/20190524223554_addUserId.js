
exports.up = function(knex, Promise) {
    return knex.schema.table("events", function(table) {
        table.integer('user_id');
        table.foreign('user_id')
            .references('id')
            .on('users')
            .onDelete('cascade')
})};

exports.down = function(knex, Promise) {
  return knex.schema.table('events', function(table){
      table.dropColumnn('user_id');
  })
};
