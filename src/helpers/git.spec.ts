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

    await expect(getAuthors({ sort: true })).resolves.toStrictEqual([
      'Dalinar Kholin <dalinar@kholin.com>',
      'Hoid <hoid@cosmere.com>',
      'Kaladin Stormblessed <kaladin@stormblessed.com>',
    ]);
  });
});
