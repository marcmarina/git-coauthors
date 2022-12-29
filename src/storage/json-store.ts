import fs from 'fs/promises';
import path from 'path';

export default class JSONStore<T> {
  private filepath: string;
  private defaultValue: T;

  constructor(filepath: string, defaultValue: T) {
    this.filepath = path.join(process.cwd(), filepath);
    this.defaultValue = defaultValue;
  }

  async get(): Promise<T> {
    try {
      const fileData = await fs.readFile(this.filepath);

      return JSON.parse(fileData.toString());
    } catch (error) {
      return this.defaultValue;
    }
  }

  async store(data: T): Promise<void> {
    const dataString = JSON.stringify(data);

    await fs.writeFile(this.filepath, dataString);
  }
}
