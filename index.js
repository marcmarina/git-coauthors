#! /usr/bin/env node
import clipboardy from 'clipboardy';

import { dirIsRepo, getAuthors } from './helpers/git.js';
import { authorPrompt } from './helpers/prompt.js';

async function main() {
  const isGitRepo = await dirIsRepo();

  if (!isGitRepo) {
    console.log(
      'The current directory is not a git repository. Ending execution.',
    );

    return;
  }

  const authors = await getAuthors();

  const chosenAuthors = await authorPrompt(authors);

  if (chosenAuthors?.length) {
    const formattedAuthors = chosenAuthors.map(
      (author) => `Co-authored-by: ${author}`,
    );

    clipboardy.writeSync(formattedAuthors.join('\n'));
  }
}

main();
