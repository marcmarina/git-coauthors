import _ from 'lodash';
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
  sort = undefined,
  order = 'asc',
  recents = [],
}: {
  sort?: keyof Author;
  order?: 'asc' | 'desc';
  recents?: Author[];
} = {}): Promise<Author[]> {
  const authors = await getAllAuthors();
  const unique = _.uniqWith(authors, _.isEqual);

  if (sort) {
    return sortBy(unique, sort, order);
  } else {
    const combinedAuthors = [...recents, ...unique];

    return _.uniqWith(combinedAuthors, _.isEqual);
  }
}

async function getAllAuthors(): Promise<Author[]> {
  const fullLog = await simpleGit().log();

  const authors = fullLog.all.map((commit) => ({
    name: commit.author_name,
    email: commit.author_email,
  }));

  return authors;
}
