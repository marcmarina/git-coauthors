import clipboardy from 'clipboardy';

import { dirIsRepo, getAuthors } from '../helpers/git';
import { checkboxPrompt } from '../helpers/prompt';

async function pickAuthors({
  print,
  sort,
}: {
  print: boolean;
  sort: boolean;
}): Promise<void> {
  const isGitRepo = await dirIsRepo();

  if (!isGitRepo) {
    console.log('The current directory is not a git repository.');

    return;
  }

  const authors = await getAuthors({ sort });

  const chosenAuthors = await checkboxPrompt(authors, {
    message: 'Which co-authors do you want to select?',
  });

  if (chosenAuthors?.length) {
    const formattedAuthors = chosenAuthors.map(
      (author) => `Co-authored-by: ${author}`,
    );

    if (print) {
      console.log(formattedAuthors.join('\n'));
    }

    try {
      await clipboardy.write('\n' + formattedAuthors.join('\n'));
    } catch (err) {
      console.log(err);
    }
  }
}

export default pickAuthors;
