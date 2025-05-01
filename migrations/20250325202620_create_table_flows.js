export async function up (knex) {
  return knex.schema.createTable ('flows', table => {
    table.increments ('id').primary ();
    table.string ('name').notNullable ();
    table.jsonb ('steps').notNullable ();
    table.timestamp ('created_at').defaultTo (knex.fn.now ());
    table.timestamp ('updated_at').defaultTo (knex.fn.now ());
  });
}

export async function down (knex) {
  return knex.schema.dropTable ('flows');
}
