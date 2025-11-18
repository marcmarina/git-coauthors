import clipboardy from 'clipboardy';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { toCoauthor } from '../application';
import { schema, sql } from '../database';
import { migrateDatabase } from '../database/migrate';
import {
  assertDirIsRepo,
  getAuthors,
  multiselect,
  appendToLastCommit,
} from '../helpers';
import { initialiseStorage } from '../storage';
import { logger } from '../utils';

const pickAuthorsOptionsSchema = z.object({
  print: z.boolean(),
  sort: z.enum(['name', 'email']).optional(),
  order: z.enum(['asc', 'desc']),
  limit: z.number().optional(),
  amend: z.boolean(),
});
type Options = z.infer<typeof pickAuthorsOptionsSchema>;

export default async function pickAuthors(options: Options): Promise<void> {
  try {
    await assertDirIsRepo();
    await initialiseStorage();
    await migrateDatabase();

    const { amend, print, sort, order, limit } =
      pickAuthorsOptionsSchema.parse(options);

    const recents = await sql.query.authors.findMany();

    const authors = await getAuthors({ sort, order, recents, limit });

    const chosen = await multiselect(authors, {
      message: 'Which co-authors do you want to select?',
      toChoice: (author) => ({
        title: `${author.name} <${author.email}>`,
        value: author,
      }),
    });

    if (!chosen?.length) return;

    for (const author of chosen) {
      let storedAuthor = await sql.query.authors.findFirst({
        where: (t) => and(eq(t.name, author.name), eq(t.email, author.email)),
      });

      if (!storedAuthor) {
        const newAuthor = await sql
          .insert(schema.authors)
          .values({
            name: author.name,
            email: author.email,
          })
          .returning();

        storedAuthor = newAuthor[0];
      }
    }

    const formattedAuthors = chosen.map(toCoauthor).join('\n');

    if (print) {
      logger.info(formattedAuthors);
    }

    if (amend) {
      await appendToLastCommit('\n\n' + formattedAuthors);
    }

    await clipboardy.write('\n' + formattedAuthors);
  } catch (err) {
    logger.error(err);
  }
}
