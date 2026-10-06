import { describe, expect, it, mock } from 'bun:test';

import { doesFileOrDirExist } from './files';

const access = mock();

mock.module('fs/promises', () => ({ default: { access } }));

describe('files', () => {
  describe('doesFileOrDirExist', () => {
    it('returns true if the file exists', async () => {
      access.mockResolvedValue(undefined);

      await expect(doesFileOrDirExist('path')).resolves.toBe(true);
    });

    it("returns false if the file doesn't exist", async () => {
      access.mockRejectedValue('File not found');

      await expect(doesFileOrDirExist('path')).resolves.toBe(false);
    });
  });
});
