import inquirer from 'inquirer';
import inqurierCheckboxPlus from 'inquirer-checkbox-plus-prompt';
import fuzzy from 'fuzzy';

async function choicesSearch(data: string[], input: string): Promise<string[]> {
  input = input || '';

  const fuzzyResult = fuzzy.filter(input, data);

  return fuzzyResult.map((element) => element.original);
}

type PromptConfig = {
  pageSize?: number;
  message?: string;
};

/**
 * @param data List of available options.
 * @param config Prompt config.
 * @returns User picked options.
 */
export async function checkboxPrompt(
  data: string[],
  { pageSize = 10, message = 'Select options' }: PromptConfig = {},
): Promise<string[]> {
  inquirer.registerPrompt('checkbox-plus', inqurierCheckboxPlus);

  const { choices } = await inquirer.prompt([
    {
      type: 'checkbox-plus',
      message: `${message} (type for autocomplete)`,
      pageSize: pageSize,
      name: 'choices',
      source: async (_: any, input: string) => choicesSearch(data, input),
      searchable: true,
    },
  ]);

  return choices;
}
