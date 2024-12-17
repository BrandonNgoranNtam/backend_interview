const app = require('../../server-config.js');
const todos = require('./todos.handlers.js');
const authenticate = require('../../middleware/auth.js');


app.get('/', authenticate, todos.getAllTodos); // Get all todos
app.get('/:id', authenticate, todos.getTodo); // Get a specific todo

app.post('/', authenticate, todos.postTodo); // Create a new todo
app.patch('/:id', authenticate, todos.patchTodo); // Patch a specific todo

app.delete('/', authenticate, todos.deleteAllTodos); // Delete all todos
app.delete('/:id',authenticate,  todos.deleteTodo); // Delete a specific todo

module.exports = app;
