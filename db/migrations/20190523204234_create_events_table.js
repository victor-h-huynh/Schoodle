exports.up = function(knex, Promise) {
  return knex.schema.createTable("events", function(table) {
    table
      .increments("id")
      .primary()
      .unsigned();
    table.string("title").notNullable();
    table.text("description");
    table.string("url").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("events");
};
