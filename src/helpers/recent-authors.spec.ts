import { Author } from '../application';
import { createJSONStore } from '../storage';

import { createRecentAuthorService } from './recent-authors';

jest.mock('../storage', () => ({
  ...jest.requireActual('../storage'),
  createJSONStore: jest.fn(),
}));

jest.mocked(createJSONStore).mockReturnValue({
  get: jest.fn(),
  store: jest.fn(),
  delete: jest.fn(),
});
const mockStorage = jest.mocked(
  createJSONStore<Author[]>('some-file.json', []),
);

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
