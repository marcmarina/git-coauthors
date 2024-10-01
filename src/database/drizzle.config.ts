import path from 'path';

import { defineConfig } from 'drizzle-kit';

import { STORAGE_DIR } from '../storage';

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './src/database/drizzle',
  dialect: 'sqlite',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: path.join(STORAGE_DIR, 'db.sqlite'),
  },
});
