import { relations } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const authors = sqliteTable('authors', {
  id: integer('id')
    .primaryKey({
      autoIncrement: true,
    })
    .unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

export const authorsRelations = relations(authors, ({ many }) => {
  return {
    authorsToRepositories: many(authorsToRepositories),
  };
});

export const repositories = sqliteTable('repositories', {
  id: integer('id')
    .primaryKey({
      autoIncrement: true,
    })
    .unique(),
  name: text('name').notNull().unique(),
});

export const repositoriesRelations = relations(repositories, ({ many }) => {
  return {
    authorsToRepositories: many(authorsToRepositories),
  };
});

export const authorsToRepositories = sqliteTable(
  'authors_to_repositories',
  {
    authorId: integer('author_id')
      .unique()
      .notNull()
      .references(() => authors.id),
    repositoryId: integer('repository_id')
      .unique()
      .notNull()
      .references(() => repositories.id),
  },
  (t) => {
    return {
      pk: primaryKey({
        columns: [t.authorId, t.repositoryId],
      }),
    };
  },
);

export const authorsToRepositoriesRelations = relations(
  authorsToRepositories,
  ({ one }) => {
    return {
      author: one(authors, {
        fields: [authorsToRepositories.authorId],
        references: [authors.id],
      }),
      repository: one(repositories, {
        fields: [authorsToRepositories.repositoryId],
        references: [repositories.id],
      }),
    };
  },
);
