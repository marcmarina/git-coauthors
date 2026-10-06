import { describe, expect, it, mock } from 'bun:test';

import * as storage from '../storage';

import { createRecentAuthorService } from './recent-authors';

const mockStorage = {
  get: mock(),
  store: mock(),
  delete: mock(),
};
const actualStorage = { ...storage };

mock.module('../storage', () => ({
  ...actualStorage,
  createJSONStore: () => mockStorage,
}));

describe('RecentAuthorService', () => {
  const recentAuthorService = createRecentAuthorService();

  it('returns the list of stored authors', async () => {
    mockStorage.get.mockResolvedValueOnce([
      { name: 'John Doe', email: 'john@doe.com' },
    ]);

    const result = await recentAuthorService.get();

    expect(result).toEqual([{ name: 'John Doe', email: 'john@doe.com' }]);
  });

  it('adds the given authors to the list of stored authors', async () => {
    mockStorage.get.mockResolvedValue([
      { name: 'Jane Doe', email: 'jane@doe' },
    ]);

    await recentAuthorService.add([
      { name: 'John Doe', email: 'john@doe.com' },
    ]);

    expect(mockStorage.store).toHaveBeenCalledWith([
      {
        name: 'John Doe',
        email: 'john@doe.com',
      },
      {
        name: 'Jane Doe',
        email: 'jane@doe',
      },
    ]);
  });

  it('clears the list of stored authors', async () => {
    await recentAuthorService.clear();

    expect(mockStorage.delete).toHaveBeenCalled();
  });
});
