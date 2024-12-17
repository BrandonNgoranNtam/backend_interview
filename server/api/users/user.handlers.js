const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addErrorReporting } = require('../../utils');
const users = require('../../database/user-queries.js');



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

const toExport = {
    registerUser: { method: registerUser, errorMessage: "Could not register the user"},
    loginUser: {method: loginUser, errorMessage: "Could not log user in"}
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;


