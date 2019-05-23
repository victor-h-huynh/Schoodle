exports.up = function(knex, Promise) {
  return knex.schema.createTable("votes", function(table) {
    table
      .increments("id")
      .primary()
      .unsigned();

    table.integer("user_id");
    table.integer("timeslot_id");

    table
      .foreign("user_id")
      .references("id")
      .on("users")
      .onDelete("cascade");

    table
      .foreign("timeslot_id")
      .references("id")
      .on("timeslots")
      .onDelete("cascade");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("votes");
};
