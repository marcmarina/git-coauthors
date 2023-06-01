import fs from 'fs/promises';

import { doesFileOrDirExist } from './files';

jest.mock('fs/promises');

describe('files', () => {
  const mockedFs = jest.mocked(fs);

  describe('doesFileOrDirExist', () => {
    it('returns true if the file exists', async () => {
      mockedFs.access.mockResolvedValue();

      await expect(doesFileOrDirExist('path')).resolves.toBe(true);
    });

    it("returns false if the file doesn't exist", async () => {
      mockedFs.access.mockRejectedValue('File not found');

      await expect(doesFileOrDirExist('path')).resolves.toBe(false);
    });
  });
});
