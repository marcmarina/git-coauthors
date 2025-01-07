import path from 'path';

import { Author } from '../application';
import { STORAGE_DIR, createJSONStore } from '../storage';
import { combineUnique } from '../utils';

/**
 * @returns The path to the file where the co-authors are stored for the current working directory.
 */
function getAuthorsFilePath(): string {
  return path.join(STORAGE_DIR, `authors.json`);
}

export function createRecentAuthorService() {
  const recentAuthorStore = createJSONStore<Author[]>(getAuthorsFilePath(), []);

  async function get(): Promise<Author[]> {
    return await recentAuthorStore.get();
  }

  async function add(authors: Author[]) {
    const recentAuthors = await get();

    await recentAuthorStore.store(combineUnique(authors, recentAuthors));
  }

  async function clear() {
    await recentAuthorStore.delete();
  }

  return {
    get,
    add,
    clear,
  };
}
