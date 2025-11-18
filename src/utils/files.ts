import fs from 'fs';
import path from 'path';

/**
 * @returns The name of the current working directory.
 */
export function getCurrentDirName() {
  return path.basename(process.cwd());
}

/**
 * @param path The path to the file or directory to check.
 * @returns Whether the file or directory exists.
 */
export function doesFileOrDirExist(path: string): boolean {
  try {
    fs.accessSync(path);

    return true;
  } catch (error) {
    return false;
  }
}
