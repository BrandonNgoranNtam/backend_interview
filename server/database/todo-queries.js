const knex = require("./connection.js");

async function all(userId) {
    return knex('todos').where({user_id: userId});
}

async function get(id,userId) {
    const results = await knex('todos').where({ id, user_id: userId});
    return results[0];
}

async function create(title, order,userId) {
    const results = await knex('todos').insert({ title, order, user_id: userId}).returning('*');
    return results[0];
}

async function update(id, properties, userId) {
    const results = await knex('todos').where({ id, user_id: userId }).update({ ...properties }).returning('*');
    return results[0];
}

// delete is a reserved keyword
async function del(id, userId) {
    const results = await knex('todos').where({ id, user_id: userId }).del().returning('*');
    return results[0];
}

async function clear(userId) {
    return knex('todos').where({user_id: userId}).del().returning('*');
}

module.exports = {
    all,
    get,
    create,
    update,
    delete: del,
    clear
}