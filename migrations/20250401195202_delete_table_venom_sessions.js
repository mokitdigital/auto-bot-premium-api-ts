export async function up (knex) {
  await knex.schema.dropTable('venom_sessions');
}

export async function down (knex) {
  await knex.schema.createTable('venom_sessions', table => {
    table.increments('id').primary();
    table.string('session_name').notNullable().unique();
    table.jsonb('session_data').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}