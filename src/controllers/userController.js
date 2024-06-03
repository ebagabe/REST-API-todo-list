const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já está em uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({ username, email, password: hashedPassword });

        return res.status(201).json({ user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Falha ao registrar usuário' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Dados incorretos ou usuário não disponível' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais invalidas' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        await UserModel.deleteById(userId);

        return res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Falha ao excluir usuário' });
    }
}