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
});