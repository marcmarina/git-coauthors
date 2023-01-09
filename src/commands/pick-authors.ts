import clipboardy from 'clipboardy';
import z from 'zod';

import { Author, toCoauthor } from '../application';
import { assertDirIsRepo, getAuthors, checkboxPrompt } from '../helpers';
import { getAuthorsFilePath, JSONStore } from '../storage';
import { combineUnique } from '../utils';

const pickAuthorsOptionsSchema = z.object({
  print: z.boolean(),
  sort: z.enum(['name', 'email']).optional(),
  order: z.enum(['asc', 'desc']),
  limit: z.number().optional(),
});
type Options = z.infer<typeof pickAuthorsOptionsSchema>;

export default async function pickAuthors(options: Options): Promise<void> {
  try {
    await assertDirIsRepo();

    const { print, sort, order, limit } =
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
      console.log(formattedAuthors);
    }

    await clipboardy.write('\n' + formattedAuthors);
  } catch (err) {
    console.log(err);
  }
}
