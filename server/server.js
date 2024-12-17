const app = require('./server-config.js');
const routes = require('./server-routes.js');
const authenticate = require('./middleware/auth.js')

const port = process.env.PORT || 5000;

app.get('/', authenticate, routes.getAllTodos); // Get all todos
app.get('/:id', authenticate, routes.getTodo); // Get a specific todo

app.post('/', authenticate, routes.postTodo); // Create a new todo
app.patch('/:id', authenticate, routes.patchTodo); // Patch a specific todo

app.delete('/', authenticate, routes.deleteAllTodos); // Delete all todos
app.delete('/:id',authenticate,  routes.deleteTodo); // Delete a specific todo

app.post('/users/register', routes.registerUser); // Register a new user
app.post('/users/login',routes.loginUser) // Login a user


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;