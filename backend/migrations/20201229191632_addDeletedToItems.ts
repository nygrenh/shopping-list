import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("items", (tableBuilder) => {
    tableBuilder.boolean("deleted").notNullable().defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("items", (tableBuilder) => {
    tableBuilder.dropColumn("deleted")
  })
}

