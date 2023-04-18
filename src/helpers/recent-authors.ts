import path from 'path';

import { JSONStore, STORAGE_DIR } from '@internal/storage';
import { Author } from '@internal/types';
import { combineUnique, getCurrentDirName } from '@internal/utils';

/**
 * @returns The path to the file where the co-authors are stored for the current working directory.
 */
function getAuthorsFilePath(): string {
  return path.join(STORAGE_DIR, `${getCurrentDirName()}.json`);
}

export class RecentAuthorService {
  private recentAuthorStore: JSONStore<Author[]>;

  constructor() {
    this.recentAuthorStore = new JSONStore<Author[]>(getAuthorsFilePath(), []);
  }

  async get(): Promise<Author[]> {
    return await this.recentAuthorStore.get();
  }

  async add(authors: Author[]) {
    const recentAuthors = await this.get();

    await this.recentAuthorStore.store(combineUnique(authors, recentAuthors));
  }

  async clear() {
    await this.recentAuthorStore.delete();
  }
}
