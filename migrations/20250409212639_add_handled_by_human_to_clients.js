export function up(knex) {
  return knex.schema.table("clients", function (table) {
    table.boolean("handled_by_human").defaultTo(false);
  });
}

export function down(knex) {
  return knex.schema.table("clients", function (table) {
    table.dropColumn("handled_by_human");
  });
}
