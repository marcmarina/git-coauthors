import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { currentDirName, doesFileOrDirExist } from '../utils';

const storageDir = path.join(os.homedir(), `.git-coauthors`);

/**
 * @returns The path to the file where the co-authors are stored for the current working directory.
 */
export function getAuthorsFilePath(): string {
  return path.join(storageDir, `${currentDirName()}.json`);
}

/**
 * Function that creates the storage directory if it doesn't exist.
 */
export async function initialiseStorage(): Promise<void> {
  const doesStorageDirExist = await doesFileOrDirExist(storageDir);

  if (!doesStorageDirExist) {
    await fs.mkdir(storageDir);
  }
}
