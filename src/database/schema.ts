import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const authors = sqliteTable('authors', {
  id: integer('id')
    .primaryKey({
      autoIncrement: true,
    })
    .unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});
