export async function up (knex) {
  return knex.schema.createTable ('session_tokens', table => {
    table.increments ('id').primary ();
    table.string ('session_name').notNullable ().unique ();
    table.binary ('zip_data').notNullable ();
    table.timestamp ('created_at').defaultTo (knex.fn.now ());
  });
}

export async function down (knex) {
  return knex.schema.dropTableIfExists ('session_tokens');
}