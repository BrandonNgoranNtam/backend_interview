const knex = require("./connection.js");





async function getUser(username) {
    const results = await knex('users').where({ username });
    return results[0];
}

async function createUser(username, password) {
    const result = await knex('users').insert({ username, password }).returning('*');
    return result;
}



module.exports = {
    getUser,
    createUser
}