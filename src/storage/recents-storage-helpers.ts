import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const storageDir = path.join(os.homedir(), `.git-coauthors`);

/**
 * @returns The path to the file where the co-authors are stored for the current working directory.
 */
export function getAuthorsFilePath(): string {
  return path.join(storageDir, `${currentDirName()}.json`);
}

function currentDirName() {
  return path.basename(process.cwd());
}

/**
 * Function that creates the storage directory if it doesn't exist.
 */
export async function initialiseStorage(): Promise<void> {
  if (!(await doesEntryExist(storageDir))) {
    await fs.mkdir(storageDir);
  }
}

async function doesEntryExist(path: string): Promise<boolean> {
  try {
    await fs.access(path);

    return true;
  } catch (error) {
    return false;
  }
}
