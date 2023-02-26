import fs from 'fs/promises';

import { doesFileOrDirExist, logger } from '../utils';

export class JSONStore<T> {
  private filepath: string;
  private defaultValue: T;

  constructor(filepath: string, defaultValue: T) {
    this.filepath = filepath;
    this.defaultValue = defaultValue;
  }

  async delete(): Promise<void> {
    try {
      await fs.unlink(this.filepath);
    } catch (error) {
      logger.error(`Error while deleting ${this.filepath} file: ${error}`);
    }
  }

  async get(): Promise<T> {
    try {
      const fileExists = await this.doesFileExist();

      if (!fileExists) {
        return this.defaultValue;
      }

      const fileData = await fs.readFile(this.filepath);

      return JSON.parse(fileData.toString());
    } catch (error) {
      logger.error(
        `Error while reading data in ${this.filepath}: ${error}. Returning default value.`,
      );
      return this.defaultValue;
    }
  }

  private async doesFileExist(): Promise<boolean> {
    return await doesFileOrDirExist(this.filepath);
  }

  async store(data: T): Promise<void> {
    try {
      const dataString = JSON.stringify(data, null, 2);

      await fs.writeFile(this.filepath, dataString);
    } catch (error) {
      logger.error(`Error while storing data in ${this.filepath}: ${error}`);
    }
  }
}
