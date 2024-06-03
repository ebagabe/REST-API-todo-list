const knex = require('knex')(require('../../knexfile')['development']);

exports.create = async ({ title, description, userId }) => {
    try {
        const [todoId] = await knex('todos').insert({ title, description, user_id: userId });
        return { id: todoId, title, description, userId };
    } catch (error) {
        throw new Error(error);
    }
};

exports.getAllByUserId = async (userId) => {
    try {
        const todos = await knex('todos').where({ user_id: userId });
        return todos;
    } catch (error) {
        throw new Error(error);
    }
};

exports.getByIdAndUserId = async (todoId, userId) => {
    try {
        const todo = await knex('todos').where({ id: todoId, user_id: userId }).first();
        return todo;
    } catch (error) {
        throw new Error(error);
    }
};

exports.update = async(todoId, { title, completed, userId }) => {
    try {
        await knex('todos').where({id: todoId, user_id: userId}).update({title, completed});
        const updatedTodo = await knex('todos').where({id: todoId, user_id: userId}).first();
        return updatedTodo;
    } catch (error) {
        throw new Error(error);
    }
};

exports.delete = async (todoId, userId) => {
    try {
        await knex('todos').where({id: todoId, user_id: userId}).del();
    } catch (error) {
        throw new Error(error);
    }
}