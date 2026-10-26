import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from 'bun:test';

import clipboardy from 'clipboardy';

import * as helpers from '../helpers';
import * as storage from '../storage';
import { logger } from '../utils';

import pickAuthors from './pick-authors';

const recentAuthorService = {
  get: mock(),
  add: mock(),
  clear: mock(),
};

const spies = {
  assertDirIsRepo: spyOn(helpers, 'assertDirIsRepo'),
  getAuthors: spyOn(helpers, 'getAuthors'),
  multiselect: spyOn(helpers, 'multiselect'),
  addCoauthorsToLastCommit: spyOn(helpers, 'addCoauthorsToLastCommit'),
  createRecentAuthorService: spyOn(helpers, 'createRecentAuthorService'),
  initialiseStorage: spyOn(storage, 'initialiseStorage'),
  info: spyOn(logger, 'info'),
  error: spyOn(logger, 'error'),
  clipboardWrite: spyOn(clipboardy, 'write'),
};

const AUTHORS = [
  { name: 'Hoid', email: 'hoid@cosmere.com' },
  { name: 'Dalinar Kholin', email: 'dalinar@kholin.com' },
];
const TRAILERS =
  'Co-authored-by: Hoid <hoid@cosmere.com>\n' +
  'Co-authored-by: Dalinar Kholin <dalinar@kholin.com>';

const defaultOptions = {
  print: false,
  copy: true,
  order: 'asc' as const,
  amend: false,
};

describe('pickAuthors', () => {
  beforeEach(() => {
    process.exitCode = 0;
    spies.assertDirIsRepo.mockResolvedValue(undefined);
    spies.initialiseStorage.mockResolvedValue(undefined);
    spies.createRecentAuthorService.mockReturnValue(recentAuthorService);
    spies.getAuthors.mockResolvedValue(AUTHORS);
    spies.multiselect.mockResolvedValue(AUTHORS);
    spies.addCoauthorsToLastCommit.mockResolvedValue(undefined);
    spies.info.mockImplementation(() => {});
    spies.error.mockImplementation(() => {});
    spies.clipboardWrite.mockResolvedValue(undefined);
    recentAuthorService.get.mockResolvedValue([]);
  });

  afterEach(() => {
    process.exitCode = 0;
    Object.values(spies).forEach((spy) => spy.mockReset());
    Object.values(recentAuthorService).forEach((fn) => fn.mockReset());
  });

  afterAll(() => {
    Object.values(spies).forEach((spy) => spy.mockRestore());
  });

  it('copies the chosen authors to the clipboard and saves them as recents', async () => {
    await pickAuthors(defaultOptions);

    expect(spies.clipboardWrite).toHaveBeenCalledWith('\n' + TRAILERS);
    expect(recentAuthorService.add).toHaveBeenCalledWith(AUTHORS);
    expect(spies.info).not.toHaveBeenCalled();
    expect(spies.addCoauthorsToLastCommit).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(0);
  });

  it('prints the chosen authors instead of copying them with --print', async () => {
    await pickAuthors({ ...defaultOptions, print: true });

    expect(spies.info).toHaveBeenCalledWith(TRAILERS);
    expect(spies.clipboardWrite).not.toHaveBeenCalled();
  });

  it("doesn't copy the chosen authors with --no-copy", async () => {
    await pickAuthors({ ...defaultOptions, copy: false });

    expect(spies.clipboardWrite).not.toHaveBeenCalled();
    expect(spies.info).not.toHaveBeenCalled();
  });

  it('adds the chosen authors to the last commit with --amend', async () => {
    await pickAuthors({ ...defaultOptions, amend: true });

    expect(spies.addCoauthorsToLastCommit).toHaveBeenCalledWith(AUTHORS);
    expect(spies.clipboardWrite).toHaveBeenCalledWith('\n' + TRAILERS);
  });

  it.each([[undefined], [[]]])(
    'does nothing when no authors are chosen (%p)',
    async (chosen) => {
      spies.multiselect.mockResolvedValue(chosen as any);

      await pickAuthors({ ...defaultOptions, amend: true });

      expect(recentAuthorService.add).not.toHaveBeenCalled();
      expect(spies.addCoauthorsToLastCommit).not.toHaveBeenCalled();
      expect(spies.clipboardWrite).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(0);
    },
  );

  it('logs the error and sets a failing exit code outside a git repository', async () => {
    spies.assertDirIsRepo.mockRejectedValue(
      new Error('The current directory is not a git repository.'),
    );

    await pickAuthors(defaultOptions);

    expect(spies.error).toHaveBeenCalledWith(
      'The current directory is not a git repository.',
    );
    expect(spies.multiselect).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it('logs the error and sets a failing exit code when copying fails', async () => {
    spies.clipboardWrite.mockRejectedValue(new Error("Couldn't find xsel"));

    await pickAuthors(defaultOptions);

    expect(spies.error).toHaveBeenCalledWith("Couldn't find xsel");
    expect(process.exitCode).toBe(1);
  });

  it('logs the error and sets a failing exit code when amending fails', async () => {
    spies.addCoauthorsToLastCommit.mockRejectedValue(
      new Error('fatal: You have nothing to amend.'),
    );

    await pickAuthors({ ...defaultOptions, amend: true });

    expect(spies.error).toHaveBeenCalledWith(
      'fatal: You have nothing to amend.',
    );
    expect(spies.clipboardWrite).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });
});
