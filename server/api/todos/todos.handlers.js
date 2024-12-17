const { addErrorReporting } = require('../../utils');
const _ = require('lodash');
const todos = require('../../database/todo-queries.js');


function createToDo(req, data) {
  const protocol = req.protocol, 
    host = req.get('host'), 
    id = data.id;

  return {
    title: data.title,
    order: data.order,
    completed: data.completed || false,
    url: `${protocol}://${host}/${id}`
  };
}


/**
 * Retrieves a list of all the todos for the currently logged in user.
 *
 * Extracts the user ID from the request and fetches the todo
 * with the given ID from the user's list of todos.
 */
async function getAllTodos(req, res) {
  const userId = req.user.id;
  const allEntries = await todos.all(userId);
  return res.send(allEntries.map( _.curry(createToDo)(req) ));
}

/**
 * Retrieves a specific todo for the currently logged in user.
 *
 * Extracts the user ID from the request and fetches the todo
 * with the given ID from the user's list of todos.
 */

async function getTodo(req, res) {
  const userId = req.user.id;
  const todo = await todos.get(req.params.id,userId);
  return res.send(todo);
}

/**
 * Creates a new todo for the currently logged in user.
 *
 * Extracts the user ID from the request and creates a new todo
 * with the given title and order, and adds it to the user's list
 * of todos.
 */
async function postTodo(req, res) {
  const userId = req.user.id;
  const created = await todos.create(req.body.title, req.body.order, userId);
  return res.send(createToDo(req, created));
}

/**
 * Patches a specific todo for the currently logged in user.
 *
 * Extracts the user ID from the request and patches the todo
 * with the given ID from the user's list of todos with the given fields.
 */
async function patchTodo(req, res) {
  const userId = req.user.id;
  const patched = await todos.update(req.params.id, req.body, userId);
  return res.send(createToDo(req, patched));
}

/**
 * Deletes all the todos for the currently logged in user.
 *
 * Extracts the user ID from the request, and then deletes all the
 * todos for the user. Returns a list of all the deleted todos.
 */
async function deleteAllTodos(req, res) {
  const userId = req.user.id;
  const deletedEntries = await todos.clear(userId);
  return res.send(deletedEntries.map( _.curry(createToDo)(req) ));
}

/**
 * Deletes a specific todo for the currently logged in user.
 *
 * Extracts the user ID from the request and deletes the todo
 * with the given ID from the user's list of todos. Returns the
 * deleted todo.
 */

async function deleteTodo(req, res) {
  const userId = req.user.id;
  const deleted = await todos.delete(req.params.id, userId);
  return res.send(createToDo(req, deleted));
}

const toExport = {
    getAllTodos: { method: getAllTodos, errorMessage: "Could not fetch all todos" },
    getTodo: { method: getTodo, errorMessage: "Could not fetch todo" },
    postTodo: { method: postTodo, errorMessage: "Could not post todo" },
    patchTodo: { method: patchTodo, errorMessage: "Could not patch todo" },
    deleteAllTodos: { method: deleteAllTodos, errorMessage: "Could not delete all todos" },
    deleteTodo: { method: deleteTodo, errorMessage: "Could not delete todo" },
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;
