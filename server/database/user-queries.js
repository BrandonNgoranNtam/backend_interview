const knex = require("./connection.js");

/**
 * Returns the user with the given username, or null if the user does not exist
 */
async function getUser(username) {
    const results = await knex('users').where({ username });
    return results[0];
}

/**
 * Creates a new user with the given username and password.
 */
async function createUser(username, password) {
    const result = await knex('users').insert({ username, password }).returning('*');
    return result;
}


module.exports = {
    getUser,
    createUser
}