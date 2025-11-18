import fs from 'fs';
import os from 'os';
import path from 'path';

import { doesFileOrDirExist, logger } from '../utils';

/**
 * The directory where data for this application is stored.
 */
export const STORAGE_DIR = path.join(os.homedir(), `.git-coauthors`);

/**
 * Function that creates the storage directory if it doesn't exist.
 */
export function initialiseStorage() {
  const doesStorageDirExist = doesFileOrDirExist(STORAGE_DIR);

  if (!doesStorageDirExist) {
    fs.mkdirSync(STORAGE_DIR);
    logger.success(
      `Created storage directory at ${STORAGE_DIR}. You will only see this message once.`,
    );
  }
}
