import clipboardy from 'clipboardy';
import { dirIsRepo, getAuthors } from '../helpers/git.js';
import { checkboxPrompt } from '../helpers/prompt.js';

async function pickAuthors() {
  const isGitRepo = await dirIsRepo();

  if (!isGitRepo) {
    console.log('The current directory is not a git repository.');

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

    try {
      clipboardy.writeSync('\n' + formattedAuthors.join('\n'));
      console.log(formattedAuthors.join('\n'));
    } catch (err) {
      console.log(err);
    }
  }
}

export default pickAuthors;
