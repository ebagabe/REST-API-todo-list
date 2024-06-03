/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashed_password' },
    { id: 2, username: 'anotheruser', email: 'another@example.com', password: 'hashed_password' }
  ]);
};