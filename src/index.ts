#! /usr/bin/env node
import { program } from 'commander';

import pickAuthors from './commands/pick-authors';
import config from './helpers/config';

program
  .version(config.version)
  .description(
    'Pick co-authors from a list and add them to your clipboard (e.g. Co-authored-by: John Doe <jdoe@example.com>).',
  )
  .addHelpCommand()
  .option('-p, --print', 'Print the chosen authors to the console', false)
  .option('-s, --sort', 'Sort the authors alphabetically', false);

program.parse(process.argv);

const options = program.opts();

pickAuthors({
  print: options.print,
  sort: options.sort,
});
