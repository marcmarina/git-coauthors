#! /usr/bin/env node
import { program } from 'commander';

import config from './helpers/config';
import pickAuthors from './commands/pick-authors';

program.version(config.version).description('Git co-author picker');

program
  .command('pick-authors', { isDefault: true })
  .description('Pick co-authors from a list')
  .action(pickAuthors);

program.parse();
