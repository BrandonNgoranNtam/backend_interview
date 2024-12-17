const app = require('../../server-config.js');
const users = require('./user.handlers.js');


app.post('/register', users.registerUser); // Register a new user
app.post('/login',users.loginUser) // Login a user


module.exports = app;
