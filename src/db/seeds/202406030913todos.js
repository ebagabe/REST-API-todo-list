/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('todos').del();
  await knex('todos').insert([
    { id: 1, title: 'First Todo', description: 'Description for first todo', completed: false, user_id: 1 },
    { id: 2, title: 'Second Todo', description: 'Description for second todo', completed: false, user_id: 1 }
  ]);
};