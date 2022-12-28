import { simpleGit } from 'simple-git';

export type Author = {
  author: string;
  commits: number;
};

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
  const fullLog = await simpleGit().log();

  const formattedLog = fullLog.all.reduce((acc, logEntry) => {
    const author = `${logEntry.author_name} <${logEntry.author_email}>`;

    if (acc[author]) {
      acc[author] += 1;
    } else {
      acc[author] = 1;
    }

    return acc;
  }, {});

  const authors: Author[] = [];

  for (const [key, value] of Object.entries(formattedLog)) {
    authors.push({ author: key, commits: value as number });
  }

  return authors;
}
