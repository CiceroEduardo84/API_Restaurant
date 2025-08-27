import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("Orders", (table) => {
    table.increments("id").primary();
    table
      .integer("table_session_id")
      .notNullable()
      .references("id")
      .inTable("tables_session");
    table
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products");
    table.integer("quantity").notNullable();
    table.decimal("price").notNullable();
    table.integer("created_at").defaultTo(knex.fn.now());
    table.integer("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("Orders");
}
