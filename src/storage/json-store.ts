import fs from 'fs/promises';
import path from 'path';

export default class JSONStore<T> {
  private filepath: string;
  private defaultValue: T;

  constructor(filepath: string, defaultValue: T) {
    this.filepath = path.join(process.cwd(), filepath);
    this.defaultValue = defaultValue;
  }

  async delete(): Promise<void> {
    try {
      await fs.unlink(this.filepath);
    } catch (error) {
      console.log(`Error while deleting ${this.filepath} file: ${error}`);
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
      console.log(
        `Error while reading data in ${this.filepath}: ${error}. Returning default value.`,
      );
      return this.defaultValue;
    }
  }

  private async doesFileExist(): Promise<boolean> {
    try {
      await fs.access(this.filepath);

      return true;
    } catch (error) {
      return false;
    }
  }

  async store(data: T): Promise<void> {
    try {
      const dataString = JSON.stringify(data);

      await fs.writeFile(this.filepath, dataString);
    } catch (error) {
      console.log(`Error while storing data in ${this.filepath}: ${error}`);
    }
  }
}
