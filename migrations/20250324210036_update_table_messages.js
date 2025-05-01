export async function up (knex) {
  await knex.schema.alterTable ('messages', async table => {
    const hasColumn = async column => {
      const exists = await knex.schema.hasColumn ('messages', column);
      return exists;
    };

    if (!await hasColumn ('number_recipient')) {
      table.string ('number_recipient').notNullable ();
    }
    if (!await hasColumn ('number_sender')) {
      table.string ('number_sender').notNullable ();
    }
    if (!await hasColumn ('status')) {
      table
        .enum ('status', ['pending', 'sent', 'failed'])
        .defaultTo ('pending');
    }
    if (!await hasColumn ('message_error')) {
      table.text ('message_error');
    }
  });
}

export async function down (knex) {
  await knex.schema.alterTable ('messages', table => {
    table.dropColumn ('number_recipient');
    table.dropColumn ('number_sender');
    table.dropColumn ('status');
    table.dropColumn ('message_error');
  });
}
