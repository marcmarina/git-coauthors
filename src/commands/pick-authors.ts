import clipboardy from 'clipboardy';
import z from 'zod';

import { toCoauthor } from '../application';
import { assertDirIsRepo, getAuthors, checkboxPrompt } from '../helpers';
import { sortBy } from '../utils';

const pickAuthorsOptionsSchema = z.object({
  print: z.boolean(),
  sort: z.enum(['commits', 'name', 'email']).optional(),
  order: z.enum(['asc', 'desc']),
});

type Options = z.infer<typeof pickAuthorsOptionsSchema>;

export default async function pickAuthors(options: Options): Promise<void> {
  await assertDirIsRepo();

  const { print, sort, order } = pickAuthorsOptionsSchema.parse(options);

  const authors = await getAuthors();
  const sortedAuthors = sort ? sortBy(authors, sort, order) : authors;
  const coauthors = sortedAuthors.map(toCoauthor);

  const chosenAuthors = await checkboxPrompt(coauthors, {
    message: 'Which co-authors do you want to select?',
  });

  if (chosenAuthors?.length) {
    const formattedAuthors = chosenAuthors.map(
      (author) => `Co-authored-by: ${author}`,
    );

    if (print) {
      console.log(formattedAuthors.join('\n'));
    }

    try {
      await clipboardy.write('\n' + formattedAuthors.join('\n'));
    } catch (err) {
      console.log(err);
    }
  }
}
