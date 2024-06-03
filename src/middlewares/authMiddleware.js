const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token de autenticação não fornecido' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decodedToken.userId;

        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error('Erro de autenticação:', error);
        return res.status(401).json({ error: 'Falha na autenticação' });
    }
};

module.exports = { authenticate };