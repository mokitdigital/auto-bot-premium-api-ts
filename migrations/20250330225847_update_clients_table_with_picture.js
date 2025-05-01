export async function up (knex) {
  return knex.schema.alterTable ('clients', table => {
    table.string ('picture').notNullable ();
  });
}

export async function down (knex) {
  return knex.schema.alterTable ('clients', table => {
    table.dropColumn ('picture');
  });
}
