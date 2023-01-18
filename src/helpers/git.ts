import { simpleGit } from 'simple-git';

import { Author } from '../application';
import { logger, sortBy, unique } from '../utils';

/**
 * Function that checks if the current directory is a git repository. If not, it exits the process.
 */
export async function assertDirIsRepo(): Promise<void> {
  if (!(await simpleGit().checkIsRepo())) {
    logger.error('The current directory is not a git repository.');
    process.exit(0);
  }
}

export async function amendLastCommit(message: string): Promise<void> {
  const git = simpleGit();

  const log = await git.log({ maxCount: 1 });

  const originalMessage = log.latest?.message;

  if (originalMessage) {
    await simpleGit().commit(`${originalMessage}${message}`, ['--amend']);
  }
}

/**
 * Function that returns a full list of unique author names and emails.
 * @returns Array of authors
 */
export async function getAuthors({
  sort = undefined,
  order = 'asc',
  recents = [],
  limit,
}: {
  sort?: keyof Author;
  order?: 'asc' | 'desc';
  recents?: Author[];
  limit?: number;
} = {}): Promise<Author[]> {
  const authors = unique(await getAllAuthors(limit));

  if (sort) {
    return sortBy(authors, sort, order);
  } else {
    const combinedAuthors = [...recents, ...authors];

    return unique(combinedAuthors);
  }
}

async function getAllAuthors(limit?: number): Promise<Author[]> {
  const fullLog = await simpleGit().log({
    maxCount: limit,
  });

  const authors = fullLog.all.map((commit) => ({
    name: commit.author_name,
    email: commit.author_email,
  }));

  return authors;
}
