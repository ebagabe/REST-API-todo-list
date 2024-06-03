const TodoModel = require('../models/todoModel');

exports.createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.userId;

        if (!title || !description) {
            return res.status(400).json({ error: 'Título e descrição são requeridos' });
        }

        const newTodo = await TodoModel.create({ title, description, userId });
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
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

exports.getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // obtém o ID do usuário do token JWT
        const todo = await TodoModel.getByIdAndUserId(id, userId);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
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