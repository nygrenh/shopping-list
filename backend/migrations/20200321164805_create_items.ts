import * as Knex from "knex"

exports.up = async (knex: Knex): Promise<any> => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  await knex.schema.createTable("items", t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"))
    t.text("text").notNullable()
    t.boolean("checked").notNullable().defaultTo(false)
    t.timestamps(true, true)
  })

}

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTableIfExists("items")
}
