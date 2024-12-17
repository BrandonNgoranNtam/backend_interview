const _ = require('lodash');
const todos = require('./database/todo-queries.js');
const users = require('./database/user-queries.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



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
 * Registers a new user with a given username and password.
 * 
 * Checks if the username is already in use. If it is, responds with a 400 status.
 * Otherwise, hashes the password and creates the user in the database.
 */

async function registerUser(req, res) {
  const { username, password } = req.body;
  
  const user = await users.getUser(username);
  if(user){
    return res.status(400).send('Username already used')
  }
  const hashedPassword = await bcrypt.hash(password,10);
  const createdUser = await users.createUser(username, hashedPassword);
  return res.status(201).send({message: "User successfully registered", createdUser})
}


/**
 * Logs in a user with the given username and password.
 * 
 * Verifies if the username exists and the password is correct. If either is invalid,
 * responds with a 401 status. If successful, generates a JWT token for the session
 * and responds with a 200 status, success message, user details, and token.
 */

async function loginUser(req,res){
  const {username, password} = req.body;
  const user = await users.getUser(username);
  if(!user){
    return res.status(401).send('Invalid credentials')
  }
  const validPassword = await bcrypt.compare(password,user.password);
  if(!validPassword){
    return res.status(401).send('Invalid credentials')
  }else{
    // IMPLEMENT JWT TOKEN FOR SESSIONS
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY)
    return res.status(200).send({message: "Login successful", user, token})
  }

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

function addErrorReporting(func, message) {
    return async function(req, res) {
        try {
            return await func(req, res);
        } catch(err) {
            console.log(`${message} caused by: ${err}`);

            // Not always 500, but for simplicity's sake.
            res.status(500).send(`Opps! ${message}.`);
        } 
    }
}

const toExport = {
    getAllTodos: { method: getAllTodos, errorMessage: "Could not fetch all todos" },
    getTodo: { method: getTodo, errorMessage: "Could not fetch todo" },
    postTodo: { method: postTodo, errorMessage: "Could not post todo" },
    patchTodo: { method: patchTodo, errorMessage: "Could not patch todo" },
    deleteAllTodos: { method: deleteAllTodos, errorMessage: "Could not delete all todos" },
    deleteTodo: { method: deleteTodo, errorMessage: "Could not delete todo" },
    registerUser: { method: registerUser, errorMessage: "Could not register the user"},
    loginUser: {method: loginUser, errorMessage: "Could not log user in"}
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;
