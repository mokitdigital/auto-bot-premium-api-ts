export async function up (knex) {
}

export async function down (knex) {
  return knex.schema.dropTableIfExists('flows');
}
