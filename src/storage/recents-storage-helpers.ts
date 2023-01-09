import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { currentDirName, doesFileOrDirExist, logger } from '../utils';

const STORAGE_DIR = path.join(os.homedir(), `.git-coauthors`);

/**
 * @returns The path to the file where the co-authors are stored for the current working directory.
 */
export function getAuthorsFilePath(): string {
  return path.join(STORAGE_DIR, `${currentDirName()}.json`);
}

/**
 * Function that creates the storage directory if it doesn't exist.
 */
export async function initialiseStorage(): Promise<void> {
  const doesStorageDirExist = await doesFileOrDirExist(STORAGE_DIR);

  if (!doesStorageDirExist) {
    await fs.mkdir(STORAGE_DIR);
    logger.success(
      `Created storage directory at ${STORAGE_DIR}. You will only see this message once.`,
    );
  }
}
