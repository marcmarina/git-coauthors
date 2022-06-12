import inquirer from 'inquirer';
import inqurierCheckboxPlus from 'inquirer-checkbox-plus-prompt';
import fuzzy from 'fuzzy';

async function choicesSearch(data, input) {
  input = input || '';

  const fuzzyResult = fuzzy.filter(input, data);

  return fuzzyResult.map((element) => element.original);
}

export async function authorPrompt(authors) {
  inquirer.registerPrompt('checkbox-plus', inqurierCheckboxPlus);

  const { chosenAuthors } = await inquirer.prompt([
    {
      type: 'checkbox-plus',
      message: `Which co-authors do you want to select? (type for autocomplete)`,
      pageSize: 10,
      name: 'chosenAuthors',
      source: async (_, input) => choicesSearch(authors, input),
      searchable: true,
    },
  ]);

  return chosenAuthors;
}
