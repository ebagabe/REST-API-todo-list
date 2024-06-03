const knex = require('knex')(require('../../knexfile')['development']);

exports.create = async ({ username, email, password }) => {
    try {
        const [userId] = await knex('users').insert({ username, email, password });
        return { id: userId, username, email };
    } catch (error) {
        throw new Error(error);
    }
};

exports.findByEmail = async (email) => {
    try {
        const user = await knex('users').where({ email }).first();
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

exports.findById = async (userId) => {
    try {
        const user = await knex('users').where({ id: userId }).first();
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

exports.deleteById = async (userId) => {
    try {
        await knex('users').where({ id: userId }).del();
    } catch (error) {
        throw new Error(error);
    }
};