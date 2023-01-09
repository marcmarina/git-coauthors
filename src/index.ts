#! /usr/bin/env node
import { Option, program } from 'commander';

import { pickAuthors } from './commands';

const packageJson = require('../package.json');

program.version(packageJson.version).description('Git co-author picker.');

program
  .command('pick', { isDefault: true })
  .description(
    'Pick co-authors from a list and add them to your clipboard (e.g. Co-authored-by: John Doe <jdoe@example.com>).',
  )
  .option(
    '-l, --limit <number>',
    'Limit the number of commits to fetch. Useful for repos with a large history.',
    parseInt,
  )
  .option('-p, --print', 'Print the chosen authors to the console', false)
  .addOption(
    new Option('-s, --sort <by>', 'Sort by').choices(['email', 'name']),
  )
  .addOption(
    new Option('-o, --order <direction>', 'Order direction')
      .choices(['asc', 'desc'])
      .default('asc'),
  )
  .action(pickAuthors);

program.parse(process.argv);
