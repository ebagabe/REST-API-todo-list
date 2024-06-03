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
});