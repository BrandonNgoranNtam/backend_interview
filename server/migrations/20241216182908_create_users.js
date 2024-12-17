
/**
 * Creates the users table
 *
 * The users table has the following columns:
 *
 * - id: A unique, auto-incrementing identifier
 * - username: The username chosen by the user. Must be unique
 * - password: The password chosen by the user. Must not be null
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table){
      table.increments('id');
      table.string("username").notNullable().unique();
      table.string("password").notNullable()
  })
};

/**
 * Reverses the operation performed by the up function.
 * Drops the users table.
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
