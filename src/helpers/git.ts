import simpleGit from 'simple-git';
import { getUniqueElements } from '../utils/array';

const git = simpleGit();

/**
 * Function that returns whether or not the current directory is a git repository.
 */
export async function dirIsRepo(): Promise<boolean> {
  return await git.checkIsRepo();
}

/**
 * Function that returns a full list of unique author names and emails.
 */
export async function getAuthors(): Promise<string[]> {
  const fullLog = await git.log();

  const formattedLog = fullLog.all.map(
    (logEntry) => `${logEntry.author_name} <${logEntry.author_email}>`,
  );

  const unique = getUniqueElements(formattedLog);
  const sorted = unique.sort((a, b) => a.localeCompare(b));

  return sorted;
}
