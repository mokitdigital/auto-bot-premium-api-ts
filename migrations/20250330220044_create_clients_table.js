export async function up (knex) {
  return knex.schema
    .createTable ('clients', table => {
      table.increments ('id').primary ();
      table.string ('name').notNullable ();
      table.string ('phone').unique ().notNullable ();
      table.timestamp ('created_at').defaultTo (knex.fn.now ());
    })
    .then (() => {
      return knex.schema.alterTable ('messages', table => {
        table
          .integer ('client_id')
          .unsigned ()
          .references ('id')
          .inTable ('clients')
          .onDelete ('CASCADE');
      });
    });
}

export async function down (knex) {
  return knex.schema
    .alterTable ('messages', table => {
      table.dropColumn ('client_id');
    })
    .then (() => {
      return knex.schema.dropTable ('clients');
    });
}
