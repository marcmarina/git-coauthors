import { afterAll, describe, expect, it, mock, spyOn } from 'bun:test';

import * as utils from '../utils';

import { createJSONStore } from './json-store';

const mockedFs = {
  readFile: mock(),
  writeFile: mock(),
  unlink: mock(),
};

mock.module('fs/promises', () => ({ default: mockedFs }));

// Spies rather than mock.module, so they can be restored for other spec files
const mockedDoesFileOrDirExist = spyOn(utils, 'doesFileOrDirExist');
const mockedLoggerError = spyOn(utils.logger, 'error').mockImplementation(
  () => {},
);

describe('JSONStore', () => {
  afterAll(() => {
    mockedDoesFileOrDirExist.mockRestore();
    mockedLoggerError.mockRestore();
  });

  const filename = 'some-file.json';
  const defaultValue = { foo: 'bar' };

  const jsonStore = createJSONStore<any>(filename, defaultValue);

  describe('get', () => {
    it('returns the default value if the file does not exist', async () => {
      mockedDoesFileOrDirExist.mockResolvedValueOnce(false);

      const result = await jsonStore.get();

      expect(result).toBe(defaultValue);
    });

    it('returns the default value if the file is empty', async () => {
      mockedDoesFileOrDirExist.mockResolvedValueOnce(true);
      mockedFs.readFile.mockResolvedValueOnce(Buffer.from(''));

      const result = await jsonStore.get();

      expect(result).toBe(defaultValue);
    });

    it('returns the default value if the file contains invalid JSON', async () => {
      mockedDoesFileOrDirExist.mockResolvedValueOnce(true);
      mockedFs.readFile.mockResolvedValueOnce(Buffer.from('invalid-json'));

      const result = await jsonStore.get();

      expect(result).toBe(defaultValue);
    });

    it('returns the data from the file if the file exists and contains valid JSON', async () => {
      mockedDoesFileOrDirExist.mockResolvedValueOnce(true);
      mockedFs.readFile.mockResolvedValueOnce(
        Buffer.from(JSON.stringify({ foo: 'bar' })),
      );

      const result = await jsonStore.get();

      expect(result).toEqual({ foo: 'bar' });
    });
  });

  describe('store', () => {
    it('stores the data in the file', async () => {
      await jsonStore.store({ foo: 'bar' });

      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        filename,
        JSON.stringify({ foo: 'bar' }, null, 2),
      );
    });
  });

  describe('delete', () => {
    it('deletes the file', async () => {
      await jsonStore.delete();

      expect(mockedFs.unlink).toHaveBeenCalledWith(filename);
    });
  });
});
