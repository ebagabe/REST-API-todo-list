const request = require('supertest');
const app = require('../src/app');
const knex = require('knex')(require('../knexfile')['development']);

describe('Api endpoints', () => {
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
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password123' });
    
        const authToken = loginResponse.body.token;
    
        const response = await request(app)
            .delete('/api/users/delete')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
    
        expect(response.body).toEqual({ message: 'Usuário excluído com sucesso' });
    });
    
    it('Should return an error if user is not authenticated', async () => {
        const response = await request(app)
            .delete('/api/users/delete')
            .expect(401);
    
        expect(response.body).toEqual({ error: 'Falha na autenticação' });
    });

    let authToken;

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
        authToken = response.body.token;
    });

    it('Should create a new todo', async () => {
        const todoData = { title: 'Test Todo' };
        const response = await request(app)
            .post('/api/todos')
            .set('Authorization', `Bearer ${authToken}`)
            .send(todoData)
            .expect(201);

        expect(response.body).toMatchObject({
            title: todoData.title
        });
    });

    it('Should get all todos', async () => {
        const response = await request(app)
            .get('/api/todos')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBe(1);
    });

    it('Should get a todo by ID', async () => {
        const todos = await request(app)
            .get('/api/todos')
            .set('Authorization', `Bearer ${authToken}`);

        const todoId = todos.body[0].id;

        const response = await request(app)
            .get(`/api/todos/${todoId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.id).toBe(todoId);
    });

    it('Should update a todo', async () => {
        const todos = await request(app)
            .get('/api/todos')
            .set('Authorization', `Bearer ${authToken}`);

        const todoId = todos.body[0].id;

        const updatedTodoData = { title: 'Updated Todo', completed: 1 };

        const response = await request(app)
            .put(`/api/todos/${todoId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedTodoData)
            .expect(200);

        expect(response.body).toMatchObject(updatedTodoData);
    });

    it('Should delete a todo', async () => {
        const todos = await request(app)
            .get('/api/todos')
            .set('Authorization', `Bearer ${authToken}`);

        const todoId = todos.body[0].id;

        await request(app)
            .delete(`/api/todos/${todoId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        const updatedTodos = await request(app)
            .get('/api/todos')
            .set('Authorization', `Bearer ${authToken}`);

        expect(updatedTodos.body.length).toBe(0);
    });
});