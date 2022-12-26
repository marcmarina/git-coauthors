import prompts from 'prompts';

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
  { message = 'Select options' }: PromptConfig,
) {
  const { choices } = await prompts({
    type: 'autocompleteMultiselect',
    name: 'choices',
    message,
    choices: data.map((entry) => ({ title: entry, value: entry })),
    instructions: false,
  });

  return choices;
}
