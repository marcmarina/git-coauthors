import fs from 'fs';

import { doesFileOrDirExist } from './files';

jest.mock('fs');

describe('files', () => {
  const mockedFs = jest.mocked(fs);

  describe('doesFileOrDirExist', () => {
    it('returns true if the file exists', async () => {
      mockedFs.accessSync.mockReturnValue();

      expect(doesFileOrDirExist('path')).toBe(true);
    });

    it("returns false if the file doesn't exist", async () => {
      mockedFs.accessSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(doesFileOrDirExist('path')).toBe(false);
    });
  });
});
