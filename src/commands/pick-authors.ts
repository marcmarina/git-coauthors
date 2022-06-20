import clipboardy from 'clipboardy';
import { dirIsRepo, getAuthors } from '../helpers/git';
import { checkboxPrompt } from '../helpers/prompt';

async function pickAuthors() {
  const isGitRepo = await dirIsRepo();

  if (!isGitRepo) {
    console.log(
      'The current directory is not a git repository. Ending execution.',
    );

    return;
  }

  const authors = await getAuthors();

  const chosenAuthors = await checkboxPrompt(authors, {
    message: 'Which co-authors do you want to select?',
  });

  if (chosenAuthors?.length) {
    const formattedAuthors = chosenAuthors.map(
      (author) => `Co-authored-by: ${author}`,
    );

    clipboardy.writeSync(formattedAuthors.join('\n'));
  }
}

export default pickAuthors;
