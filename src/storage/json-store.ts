import fs from 'fs/promises';

import { doesFileOrDirExist, logger } from '../utils';

export type JSONStore<T> = {
  get: () => Promise<T>;
  store: (data: T) => Promise<void>;
  delete: () => Promise<void>;
};

export function createJSONStore<T>(
  filepath: string,
  defaultValue: T,
): JSONStore<T> {
  async function get(): Promise<T> {
    try {
      const fileExists = await doesFileExist();

      if (!fileExists) {
        return defaultValue;
      }

      const fileData = await fs.readFile(filepath);

      return JSON.parse(fileData.toString());
    } catch (error) {
      logger.error(
        `Error while reading data in ${filepath}: ${error}. Returning default value.`,
      );
      return defaultValue;
    }
  }

  async function store(data: T): Promise<void> {
    try {
      const dataString = JSON.stringify(data, null, 2);

      await fs.writeFile(filepath, dataString);
    } catch (error) {
      logger.error(`Error while storing data in ${filepath}: ${error}`);
    }
  }

  async function deleteStore(): Promise<void> {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      logger.error(`Error while deleting ${filepath} file: ${error}`);
    }
  }

  async function doesFileExist(): Promise<boolean> {
    return await doesFileOrDirExist(filepath);
  }

  return {
    get,
    store,
    delete: deleteStore,
  };
}
