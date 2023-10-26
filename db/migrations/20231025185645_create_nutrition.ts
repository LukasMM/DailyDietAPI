import { Knex } from 'knex'
import { randomUUID } from 'node:crypto'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('nutrition', (table) => {
    table.uuid('id').defaultTo(randomUUID).primary().index()
    table.uuid('user_id').references('id').inTable('users')
    table.text('name').notNullable()
    table.text('description')
    table.timestamp('date_hour').defaultTo(knex.fn.now()).notNullable()
    table.boolean('diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('nutrition')
}
