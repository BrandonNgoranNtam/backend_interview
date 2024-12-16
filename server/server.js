const app = require('./server-config.js');
const routes = require('./server-routes.js');
const authenticate = require('./middleware/auth.js')

const port = process.env.PORT || 5000;

app.get('/', authenticate, routes.getAllTodos);
app.get('/:id', authenticate, routes.getTodo);

app.post('/', authenticate, routes.postTodo);
app.patch('/:id', authenticate, routes.patchTodo);

app.delete('/', authenticate, routes.deleteAllTodos);
app.delete('/:id',authenticate,  routes.deleteTodo);

app.post('/users/register', routes.registerUser);
app.post('/users/login',routes.loginUser)


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;