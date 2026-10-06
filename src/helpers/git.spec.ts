import { beforeEach, describe, expect, it, mock } from 'bun:test';

import { addCoauthorsToLastCommit, getAuthors } from './git';

const mockedGit = mock();

mock.module('simple-git', () => ({ simpleGit: mockedGit }));

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
    mockedGit.mockClear();
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

describe('addCoauthorsToLastCommit', () => {
  it('amends only the message, adding each author as a trailer', async () => {
    const raw = mock();

    mockedGit.mockReturnValue({ raw });

    await addCoauthorsToLastCommit([
      { name: 'Hoid', email: 'hoid@cosmere.com' },
      { name: 'Dalinar Kholin', email: 'dalinar@kholin.com' },
    ]);

    expect(raw).toHaveBeenCalledWith([
      '-c',
      'trailer.ifExists=addIfDifferent',
      'commit',
      '--amend',
      '--only',
      '--no-edit',
      '--trailer',
      'Co-authored-by: Hoid <hoid@cosmere.com>',
      '--trailer',
      'Co-authored-by: Dalinar Kholin <dalinar@kholin.com>',
    ]);
  });
});
