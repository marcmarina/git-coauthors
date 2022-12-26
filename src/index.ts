#! /usr/bin/env node
import { program } from 'commander';

import pickAuthors from './commands/pick-authors';
import config from './helpers/config';

program.version(config.version).description('Git co-author picker');

program
  .command('pick-authors', { isDefault: true })
  .description(
    'Pick co-authors from a list and add them to your clipboard (e.g. Co-authored-by: John Doe <jdoe@example.com>).',
  )
  .action(pickAuthors);

program.parse();
