#! /usr/bin/env node
import { Option, program } from 'commander';

import { pickAuthors } from './commands';
import { config } from './helpers';

program.version(config.version).description('Git co-author picker.');

program
  .command('pick', { isDefault: true })
  .description(
    'Pick co-authors from a list and add them to your clipboard (e.g. Co-authored-by: John Doe <jdoe@example.com>).',
  )
  .option('-p, --print', 'Print the chosen authors to the console', false)
  .addOption(
    new Option('-s, --sort <by>', 'Sort by').choices(['name', 'commits']),
  )
  .addOption(
    new Option('-o, --order <by>', 'Order by')
      .choices(['asc', 'desc'])
      .default('asc'),
  )
  .action(pickAuthors);

program.parse(process.argv);
