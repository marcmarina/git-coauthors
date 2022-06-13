import simpleGit from 'simple-git';
import _ from 'lodash';

const git = simpleGit();

/**
 * @returns {Promise<boolean>} Whether or not the current directory is a git repository.
 */
export async function dirIsRepo() {
  try {
    await git.log();

    return true;
  } catch (ex) {
    return false;
  }
}

/**
 * Function that returns a full list of unique author names and emails.
 * @returns {Promise<string[]>} Array of authors
 */
export async function getAuthors() {
  const fullLog = await git.log();
  const formattedLog = fullLog.all.map(
    (logEntry) => `${logEntry.author_name} <${logEntry.author_email}>`,
  );
  const unique = _.uniqWith(formattedLog, _.isEqual).sort();
  const sorted = unique.sort((a, b) => a.localeCompare(b));

  return sorted;
}
