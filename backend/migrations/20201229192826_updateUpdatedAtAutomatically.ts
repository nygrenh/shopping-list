import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
  `)
  await knex.raw(`
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();
  `)
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TRIGGER set_updated_at ON items`)
  await knex.raw(`DROP FUNCTION trigger_set_updated_at`)
}

