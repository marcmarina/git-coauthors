import fs from 'fs/promises';
import path from 'path';

/**
 * @returns The name of the current working directory.
 */
export function currentDirName() {
  return path.basename(process.cwd());
}

/**
 * @param path The path to the file or directory to check.
 * @returns Whether the file or directory exists.
 */
export async function doesFileOrDirExist(path: string): Promise<boolean> {
  try {
    await fs.access(path);

    return true;
  } catch (error) {
    return false;
  }
}
