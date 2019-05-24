exports.up = function(knex, Promise) {
  return knex.schema.createTable("timeslots", function(table) {
    table
      .increments("id")
      .primary()
      .unsigned();
    table.string("timeslot").notNullable();

    table.integer("event_id");

    table
      .foreign("event_id")
      .references("id")
      .on("events")
      .onDelete("cascade");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("timeslots");
};
