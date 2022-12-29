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
    '-r, --recents <filepath>',
    'File where the recently picked authors are stored.',
    '.coauthors',
  )
  .option(
    '-l, --limit <number>',
    'Limit the number of commits to fetch. Useful for repos with a large history.',
    parseInt,
  )
  .addOption(
    new Option('-o, --order <by>', 'Order by')
      .choices(['asc', 'desc'])
      .default('asc'),
  )
  .option('-p, --print', 'Print the chosen authors to the console', false)
  .addOption(
    new Option('-s, --sort <by>', 'Sort by').choices(['email', 'name']),
  )
  .action(pickAuthors);

program.parse(process.argv);
