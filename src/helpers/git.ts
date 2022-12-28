import { simpleGit } from 'simple-git';

import { Author } from '../application';

/**
 * @returns  Whether or not the current directory is a git repository.
 */
export async function dirIsRepo(): Promise<boolean> {
  return await simpleGit().checkIsRepo();
}

/**
 * Function that returns a full list of unique author names and emails.
 * @returns Array of authors
 */
export async function getAuthors(): Promise<Author[]> {
  const authors = await getAllAuthors();

  const authorsWithCommitCount = getAuthorsWithCommitCount(authors);

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
