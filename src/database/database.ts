import path from 'path';

import SQLite, { Database } from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { STORAGE_DIR } from '../storage';

import * as schema from './schema';

export const database: Database = new SQLite(
  path.join(STORAGE_DIR, 'db.sqlite'),
);

export const sql = drizzle(database, {
  schema: schema,
});
