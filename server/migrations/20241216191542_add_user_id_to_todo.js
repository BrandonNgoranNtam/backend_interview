
exports.up = function(knex) {
  return knex.schema.alterTable('todos', function (table) {
    table.integer('user_id');
    table.foreign('user_id').references("users.id").onDelete("CASCADE")
});
};

exports.down = function(knex) {
  return knex.schema.table("todos", function(table){
    table.dropForeign("user_id");
    table.dropColumn("user_id");
  })
};
