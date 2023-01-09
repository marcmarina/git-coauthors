import path from 'path';

/**
 * @returns The name of the current working directory
 */
export function currentDirName() {
  return path.basename(process.cwd());
}
