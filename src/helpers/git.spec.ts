import { getAuthors } from './git';

const SAMPLE_LOG = {
  all: [
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
  ],
};

jest.mock('simple-git', () => {
  return () => ({
    log: () => SAMPLE_LOG,
  });
});

describe('getAuthors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('it should return a list of sorted unique authors', async () => {
    await expect(getAuthors()).resolves.toStrictEqual([
      'Dalinar Kholin <dalinar@kholin.com>',
      'Hoid <hoid@cosmere.com>',
      'Kaladin Stormblessed <kaladin@stormblessed.com>',
    ]);
  });
});
