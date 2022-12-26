import { getAuthors } from './git';

const mockedLog = jest.fn();

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

jest.mock('simple-git', () => {
  return () => ({
    log: () => mockedLog(),
  });
});

describe('getAuthors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('it should return a list of sorted unique authors', async () => {
    mockedLog.mockResolvedValue(SAMPLE_LOG);

    await expect(getAuthors()).resolves.toStrictEqual([
      'Dalinar Kholin <dalinar@kholin.com>',
      'Hoid <hoid@cosmere.com>',
      'Kaladin Stormblessed <kaladin@stormblessed.com>',
    ]);
  });
});
