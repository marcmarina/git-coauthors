import clipboardy from 'clipboardy';
import z from 'zod';

import { toCoauthor } from '../application';
import { dirIsRepo, getAuthors, checkboxPrompt } from '../helpers';
import { sortBy } from '../utils';

const pickAuthorsOptionsSchema = z.object({
  print: z.boolean(),
  sort: z.enum(['commits', 'name']).optional(),
  order: z.enum(['asc', 'desc']),
});

type Options = z.infer<typeof pickAuthorsOptionsSchema>;

export default async function pickAuthors(options: Options): Promise<void> {
  const { print, sort, order } = pickAuthorsOptionsSchema.parse(options);

  const isGitRepo = await dirIsRepo();

  if (!isGitRepo) {
    console.log('The current directory is not a git repository.');

    return;
  }

  const authors = await getAuthors();
  const sortedAuthors = sort ? sortBy(authors, sort, order) : authors;

  const chosenAuthors = await checkboxPrompt(sortedAuthors.map(toCoauthor), {
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
