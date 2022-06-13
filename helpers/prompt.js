import inquirer from 'inquirer';
import inqurierCheckboxPlus from 'inquirer-checkbox-plus-prompt';
import fuzzy from 'fuzzy';

async function choicesSearch(data, input) {
  input = input || '';

  const fuzzyResult = fuzzy.filter(input, data);

  return fuzzyResult.map((element) => element.original);
}

/**
 * @typedef {Object} PromptConfig
 * @property {Number} [pageSize]
 * @property {String} [message]
 */

/**
 * @param {string[]} data List of available options.
 * @param {PromptConfig} config Prompt config.
 * @returns {Promise<string[]>} User picked options.
 */
export async function checkboxPrompt(
  data,
  { pageSize = 10, message = 'Select options' } = {},
) {
  inquirer.registerPrompt('checkbox-plus', inqurierCheckboxPlus);

  const { choices } = await inquirer.prompt([
    {
      type: 'checkbox-plus',
      message: `${message} (type for autocomplete)`,
      pageSize: pageSize,
      name: 'choices',
      source: async (_, input) => choicesSearch(data, input),
      searchable: true,
    },
  ]);

  return choices;
}
