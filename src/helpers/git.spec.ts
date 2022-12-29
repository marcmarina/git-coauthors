import { simpleGit } from 'simple-git';

import { getAuthors } from './git';

jest.mock('simple-git');

const mockedGit = simpleGit as jest.Mock;

const SAMPLE_LOG = {
  all: [
    {
      author_name: 'Kaladin Stormblessed',
      author_email: 'kaladin@stormblessed.com',
    },
    {
      author_name: 'Hoid',
      author_email: 'hoid@cosmere.com',
    },
    {
      author_name: 'Kaladin Stormblessed',
      author_email: 'kaladin@stormblessed.com',
    },
    {
      author_name: 'Dalinar Kholin',
      author_email: 'dalinar@kholin.com',
    },
    {
      author_name: 'Hoid',
      author_email: 'hoid@cosmere.com',
    },
    {
      author_name: 'Hoid',
      author_email: 'hoid@cosmere.com',
    },
  ],
};

describe('getAuthors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('it should return a list of sorted unique authors', async () => {
    mockedGit.mockReturnValue({
      log: () => SAMPLE_LOG,
    });

    await expect(getAuthors()).resolves.toStrictEqual([
      {
        email: 'kaladin@stormblessed.com',
        name: 'Kaladin Stormblessed',
      },
      {
        email: 'hoid@cosmere.com',
        name: 'Hoid',
      },
      {
        email: 'dalinar@kholin.com',
        name: 'Dalinar Kholin',
      },
    ]);
  });
});
