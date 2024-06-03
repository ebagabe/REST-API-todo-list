const TodoModel = require('../models/todoModel');

exports.createTodo = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.userId;

        const newTodo = await TodoModel.create({ title, userId });
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllTodos = async (req, res) => {
    try {
        const userId = req.userId;
        const todos = await TodoModel.getAllByUserId(userId);
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const userId = req.userId;

        const updatedTodo = await TodoModel.update(id, { title, completed, userId });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await TodoModel.delete(id, userId);
        res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};