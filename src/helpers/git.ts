import { simpleGit } from 'simple-git';

import { Author } from '../application';
import { sortBy } from '../utils';

/**
 * Function that checks if the current directory is a git repository. If not, it exits the process.
 */
export async function assertDirIsRepo(): Promise<void> {
  if (!(await simpleGit().checkIsRepo())) {
    console.log('The current directory is not a git repository.');
    process.exit(0);
  }
}

/**
 * Function that returns a full list of unique author names and emails.
 * @returns Array of authors
 */
export async function getAuthors({
  sort,
  order,
}: {
  sort?: keyof Author;
  order?: 'asc' | 'desc';
} = {}): Promise<Author[]> {
  const authors = await getAllAuthors();

  const authorsWithCommitCount = getAuthorsWithCommitCount(authors);

  if (sort) {
    return sortBy(authorsWithCommitCount, sort, order);
  }

  return authorsWithCommitCount;
}

async function getAllAuthors() {
  const fullLog = await simpleGit().log();

  const authors = fullLog.all.map((commit) => ({
    name: commit.author_name,
    email: commit.author_email,
  }));

  return authors;
}

function getAuthorsWithCommitCount(
  authors: { name: string; email: string }[],
): Author[] {
  const uniqueAuthors = authors.reduce((acc, author) => {
    const authorString = JSON.stringify(author);

    if (!acc[authorString]) {
      acc[authorString] = {
        ...author,
        commits: 0,
      };
    }

    acc[authorString].commits++;

    return acc;
  }, {} as Record<string, Author>);

  const uniqueAuthorsArray = Object.values(uniqueAuthors);
  return uniqueAuthorsArray;
}
