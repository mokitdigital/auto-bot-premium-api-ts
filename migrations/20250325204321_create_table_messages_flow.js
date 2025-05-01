export async function up (knex) {
  return knex.schema.createTable ('messages_flows', table => {
    table.increments ('id').primary ();
    table.string ('sender_number').notNullable ();
    table.string ('service').notNullable ();
    table.string ('site_type').notNullable ();
    table.string ('platform').notNullable ();
    table.string ('ad_platform').notNullable ();
    table.decimal ('budget').notNullable ();
    table.string ('bot_objective').notNullable ();
    table.string ('ad_objective').notNullable ();
    table.string ('other_service_details').notNullable ();
    table.integer ('current_step').notNullable ();
    table.timestamp ('created_at').defaultTo (knex.fn.now ());
    table.timestamp ('updated_at').defaultTo (knex.fn.now ());
  });
}

export async function down (knex) {
  return knex.schema.dropTable ('messages_flows');
}
