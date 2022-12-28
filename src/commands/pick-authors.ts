import clipboardy from 'clipboardy';
import z from 'zod';

import { Author, dirIsRepo, getAuthors, checkboxPrompt } from '../helpers';
import { sortBy } from '../utils';

const pickAuthorsOptionsSchema = z.object({
  print: z.boolean(),
  sort: z.enum(['commits', 'alphabetical']).optional(),
});

type Options = z.infer<typeof pickAuthorsOptionsSchema>;

export default async function pickAuthors(options: Options): Promise<void> {
  const { print, sort } = pickAuthorsOptionsSchema.parse(options);

  const isGitRepo = await dirIsRepo();

  if (!isGitRepo) {
    console.log('The current directory is not a git repository.');

    return;
  }

  const authors = await getAuthors();
  const sortedAuthors = sortByField(sort, authors);

  const chosenAuthors = await checkboxPrompt(sortedAuthors, {
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

function sortByField(sort: Options['sort'], authors: Author[]): string[] {
  switch (sort) {
    case 'commits':
      return sortBy(authors, 'commits', 'desc').map((a) => a.author);
    case 'alphabetical':
      return sortBy(authors, 'author').map((a) => a.author);
    default:
      return authors.map((a) => a.author);
  }
}
