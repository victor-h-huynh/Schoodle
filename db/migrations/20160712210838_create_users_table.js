exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(table) {
    table
      .increments("id")
      .primary()
      .unsigned();
    table.string("name").notNullable();
    table.string("email").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};