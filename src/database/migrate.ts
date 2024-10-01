import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { sql } from './database';

migrate(sql, {
  migrationsFolder: './src/database/drizzle',
});
