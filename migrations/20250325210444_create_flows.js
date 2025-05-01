export async function up (knex) {
  const exists = await knex.schema.hasTable ('flows');
  if (!exists) {
    return knex.schema.createTable ('flows', table => {
      table.increments ('id').primary ();
      table.integer ('step').notNullable ().unique ();
      table.text ('message').notNullable ();
      table.jsonb ('options');
      table.integer ('next_step');
      table.timestamps (true, true);
    });
  }
}

export function down (knex) {
  return knex.schema.dropTableIfExists ('flows');
}
