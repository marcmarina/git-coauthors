import { logger } from '@internal/logger';
import clipboardy from 'clipboardy';
import z from 'zod';

import { toCoauthor } from '../application';
import {
  assertDirIsRepo,
  getAuthors,
  multiselect,
  appendToLastCommit,
  RecentAuthorService,
} from '../helpers';
import { initialiseStorage } from '../storage';

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

    const { amend, print, sort, order, limit } =
      pickAuthorsOptionsSchema.parse(options);

    const recentAuthorService = new RecentAuthorService();

    const recents = await recentAuthorService.get();

    const authors = await getAuthors({ sort, order, recents, limit });

    const chosen = await multiselect(authors, {
      message: 'Which co-authors do you want to select?',
      toChoice: (author) => ({
        title: `${author.name} <${author.email}>`,
        value: author,
      }),
    });

    if (!chosen?.length) return;

    await recentAuthorService.add(chosen);

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
