export async function up (knex) {
  return knex.schema
    .alterTable ('session_tokens', table => {
      table.string ('file_name'); // Adiciona sem NOT NULL
      table.text ('file_content');
      table.timestamp ('updated_at').defaultTo (knex.fn.now ());
    })
    .then (async () => {
      // Atualiza registros existentes para evitar valores NULL
      await knex ('session_tokens').update ({
        file_name: 'default_filename',
        file_content: '{}',
      });
    })
    .then (() => {
      return knex.schema.alterTable ('session_tokens', table => {
        table.string ('file_name').notNullable ().alter ();
        table.text ('file_content').notNullable ().alter ();
      });
    });
}

export async function down (knex) {
  return knex.schema.alterTable ('session_tokens', table => {
    table.dropColumn ('file_name');
    table.dropColumn ('file_content');
    table.dropColumn ('updated_at');
  });
}
