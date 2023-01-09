import os from 'os';
import path from 'path';

/**
 * @returns The name of the current working directory
 */
function currentDirName() {
  return path.basename(process.cwd());
}

export function getAuthorsFilePath() {
  return path.join(os.homedir(), `.${currentDirName()}-coauthors.json`);
}
