const request = require('supertest');
const app = require('../src/app');
const knex = require('knex')(require('../knexfile')['development']);

describe('User endpoints', () => {
    beforeAll(async () => {
        await knex.migrate.rollback();
        await knex.migrate.latest();
    });

    afterAll(async () => {
        await knex.destroy();
    });

    it('Should register a new user', async () => {
        const userData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
        const response = await request(app)
            .post('/api/users/register')
            .send(userData)
            .expect(201);

        expect(response.body.user).toMatchObject({
            username: userData.username,
            email: userData.email
        });
    });

    it('Should return token when user login', async () => {
        const userData = { email: 'test@example.com', password: 'password123' };
        const response = await request(app)
            .post('/api/users/login')
            .send(userData)
            .expect(200);

        expect(response.body).toHaveProperty('token');
    });

    it('Should return an error when registering a user with duplicate email', async () => {
        const userData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
        await request(app)
            .post('/api/users/register')
            .send(userData)
            .expect(400);
    });

    it('Should return an error when registering a user with incomplete data', async () => {
        const incompleteUserData = { email: 'test@example.com', password: 'password123' };
        const response = await request(app)
            .post('/api/users/register')
            .send(incompleteUserData)
            .expect(400);

        expect(response.body).toHaveProperty('error');
    });

    it('Should return an error when login with invalid credentials', async () => {
        const invalidUserData = { email: 'invalid@example.com', password: 'invalidpassword' };
        const response = await request(app)
            .post('/api/users/login')
            .send(invalidUserData)
            .expect(401);

        expect(response.body).toHaveProperty('error');
    });

    it('Should delete the authenticated user', async () => {
        // Realiza o login para obter o token JWT válido
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password123' });
    
        const authToken = loginResponse.body.token;
    
        // Envia uma solicitação DELETE para o endpoint de exclusão de usuário
        const response = await request(app)
            .delete('/api/users/delete')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
    
        // Verifica se a resposta contém uma mensagem indicando que o usuário foi excluído com sucesso
        expect(response.body).toEqual({ message: 'Usuário excluído com sucesso' });
    });
    
    it('Should return an error if user is not authenticated', async () => {
        // Envia uma solicitação DELETE para o endpoint de exclusão de usuário sem fornecer token de autenticação
        const response = await request(app)
            .delete('/api/users/delete')
            .expect(401);
    
        // Verifica se a resposta contém uma mensagem de erro indicando que a autenticação é necessária
        expect(response.body).toEqual({ error: 'Falha na autenticação' });
    });
});