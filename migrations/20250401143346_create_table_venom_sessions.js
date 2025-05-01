export async function up (knex) {
  /**
   * CREATE TABLE venom_sessions (
        id SERIAL PRIMARY KEY,
        session_name TEXT UNIQUE NOT NULL,
        session_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
   */
  return knex.schema.createTable ('venom_sessions', table => {
    table.increments ('id').primary ();
    table.string ('session_name').notNullable ().unique ();
    table.jsonb ('session_data').notNullable ();
    table.timestamp ('created_at').defaultTo (knex.fn.now ());
    table.timestamp ('updated_at').defaultTo (knex.fn.now ());
  });
}

export function down (knex) {
  return knex.schema.dropTableIfExists ('venom_sessions');
}
