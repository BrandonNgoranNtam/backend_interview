
/**
 * Add a foreign key to the todos table that references the users.id
 * column. The foreign key is named user_id and is of type integer.
 * The onDelete("CASCADE") constraint will delete the todo if the
 * associated user is deleted.
 */
exports.up = function(knex) {
  return knex.schema.alterTable('todos', function (table) {
    table.integer('user_id');
    table.foreign('user_id').references("users.id").onDelete("CASCADE")
});
};

/**
 * Reverses the operation performed by the up function.
 * Drops the user_id column and the foreign key constraint from the todos table.
 */
exports.down = function(knex) {
  return knex.schema.table("todos", function(table){
    table.dropForeign("user_id");
    table.dropColumn("user_id");
  })
};
