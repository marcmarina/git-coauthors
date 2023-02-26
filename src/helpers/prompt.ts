import prompts from 'prompts';

type PromptConfig<T> = {
  message?: string;
  toChoice: (value: T) => prompts.Choice;
};

/**
 * @param data List of available options.
 * @param config Prompt config.
 * @returns User picked options.
 */
export async function multiselect<T>(
  data: T[],
  { message = 'Select options', toChoice }: PromptConfig<T>,
): Promise<T[]> {
  const { choices } = await prompts({
    type: 'autocompleteMultiselect',
    name: 'choices',
    message,
    choices: data.map(toChoice),
    instructions: false,
  });

  return choices;
}
