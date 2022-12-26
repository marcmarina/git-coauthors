import _ from 'lodash';
import { simpleGit } from 'simple-git';

/**
 * @returns {Promise<boolean>} Whether or not the current directory is a git repository.
 */
export async function dirIsRepo() {
  return await simpleGit().checkIsRepo();
}

/**
 * Function that returns a full list of unique author names and emails.
 * @returns {Promise<string[]>} Array of authors
 */
export async function getAuthors() {
  const fullLog = await simpleGit().log();

  const formattedLog = fullLog.all.map(
    (logEntry) => `${logEntry.author_name} <${logEntry.author_email}>`,
  );

  const unique = _.uniq(formattedLog);
  const sorted = unique.sort((a, b) => a.localeCompare(b));

  return sorted;
}
