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

async function registerUser(req, res) {
  const { username, password } = req.body;
  
  const user = await users.getUser(username);
  if(user){
    res.status(400).send('Username already used')
  }
  const hashedPassword = await bcrypt.hash(password,10);
  const createdUser = await users.createUser(username, hashedPassword);
  res.status(201).send({message: "User successfully registered", createdUser})
}


async function loginUser(req,res){
  const {username, password} = req.body;
  const user = await users.getUser(username);
  if(!user){
    res.status(401).send('Invalid credentials')
  }
  const validPassword = await bcrypt.compare(password,user.password);
  console.log("ValidPassword",validPassword)
  if(!validPassword){
    res.status(401).send('Invalid credentials')
  }else{
    // IMPLEMENT JWT TOKEN FOR SESSIONS
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY)
    res.status(200).send({message: "Login successful", user, token})
  }

}

async function getAllTodos(req, res) {
  const userId = req.user.id;
  const allEntries = await todos.all(userId);
  return res.send(allEntries.map( _.curry(createToDo)(req) ));
}

async function getTodo(req, res) {
  const userId = req.user.id;
  const todo = await todos.get(req.params.id,userId);
  return res.send(todo);
}

async function postTodo(req, res) {
  const userId = req.user.id;
  const created = await todos.create(req.body.title, req.body.order, userId);
  return res.send(createToDo(req, created));
}

async function patchTodo(req, res) {
  const userId = req.user.id;
  const patched = await todos.update(req.params.id, req.body, userId);
  return res.send(createToDo(req, patched));
}

async function deleteAllTodos(req, res) {
  const userId = req.user.id;
  const deletedEntries = await todos.clear(userId);
  return res.send(deletedEntries.map( _.curry(createToDo)(req) ));
}

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
