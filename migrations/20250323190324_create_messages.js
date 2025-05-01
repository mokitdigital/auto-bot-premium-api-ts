export function up (knex) {
  return knex.schema.createTable ('messages', table => {
    table.increments ('id').primary ();
    table.string ('number_recipient').notNullable ();
    table.string ('number_sender').notNullable ();
    table.text ('message').notNullable ();
    table.enum ('status', ['pending', 'sent', 'failed']).defaultTo ('pending');
    table.text ('message_error');
    table.timestamp ('created_at').defaultTo (knex.fn.now ());
  });
}

export function down (knex) {
  return knex.schema.dropTable ('messages');
}
