import fs from 'fs/promises';

import { doesFileOrDirExist } from '../utils';

import { JSONStore } from './json-store';

jest.mock('fs/promises');
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  logger: {
    error: jest.fn(),
  },
  doesFileOrDirExist: jest.fn(),
}));

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedDoesFileOrDirExist = doesFileOrDirExist as jest.MockedFunction<
  typeof doesFileOrDirExist
>;

describe('JSONStore', () => {
  const jsonStore = new JSONStore<any>('some-file.json', 'default-value');

  describe('get', () => {
    it('returns the default value if the file does not exist', async () => {
      mockedDoesFileOrDirExist.mockResolvedValueOnce(false);

      const result = await jsonStore.get();

      expect(result).toBe('default-value');
    });

    it('returns the default value if the file is empty', async () => {
      mockedDoesFileOrDirExist.mockResolvedValueOnce(true);
      mockedFs.readFile.mockResolvedValueOnce(Buffer.from(''));

      const result = await jsonStore.get();

      expect(result).toBe('default-value');
    });

    it('returns the default value if the file contains invalid JSON', async () => {
      mockedDoesFileOrDirExist.mockResolvedValueOnce(true);
      mockedFs.readFile.mockResolvedValueOnce(Buffer.from('invalid-json'));

      const result = await jsonStore.get();

      expect(result).toBe('default-value');
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
        'some-file.json',
        JSON.stringify({ foo: 'bar' }, null, 2),
      );
    });
  });

  describe('delete', () => {
    it('deletes the file', async () => {
      await jsonStore.delete();

      expect(mockedFs.unlink).toHaveBeenCalledWith('some-file.json');
    });
  });
});
