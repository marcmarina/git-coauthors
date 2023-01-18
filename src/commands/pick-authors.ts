import clipboardy from 'clipboardy';
import z from 'zod';

import { Author, toCoauthor } from '../application';
import {
  assertDirIsRepo,
  getAuthors,
  checkboxPrompt,
  appendToLastCommit,
} from '../helpers';
import { getAuthorsFilePath, initialiseStorage, JSONStore } from '../storage';
import { combineUnique, logger } from '../utils';

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

    const recentAuthorStore = new JSONStore<Author[]>(getAuthorsFilePath(), []);

    const recents = await recentAuthorStore.get();

    const authors = await getAuthors({ sort, order, recents, limit });

    const chosen = await checkboxPrompt(authors, {
      message: 'Which co-authors do you want to select?',
      toChoice: (author) => ({
        title: `${author.name} <${author.email}>`,
        value: author,
      }),
    });

    if (!chosen?.length) return;

    await recentAuthorStore.store(combineUnique(chosen, recents));

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
