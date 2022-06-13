#! /usr/bin/env node
import { program } from 'commander';

import config from './helpers/config.js';
import { pickAuthors } from './helpers/commands.js';

program.version(config().version).description('Git co-author picker');

program
  .command('pick-authors', { isDefault: true })
  .description('Pick co-authors from a list')
  .action(pickAuthors);

program.parse();
