import clipboardy from 'clipboardy';
import z from 'zod';

import { Author, dirIsRepo, getAuthors } from '../helpers/git';
import { checkboxPrompt } from '../helpers/prompt';

const pickAuthorsOptionsSchema = z.object({
  print: z.boolean(),
  sort: z.enum(['commits', 'recent', 'alphabetical']),
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
  const sortedAuthors = sortBy(sort, authors);

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

function sortBy(sort: Options['sort'], authors: Author[]): string[] {
  switch (sort) {
    case 'commits':
      return authors.sort((a, b) => b.commits - a.commits).map((a) => a.author);
    case 'recent':
      return authors.map((a) => a.author);
    case 'alphabetical':
      return authors
        .sort((a, b) => a.author.localeCompare(b.author))
        .map((a) => a.author);
  }
}
