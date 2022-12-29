import clipboardy from 'clipboardy';
import z from 'zod';

import { toCoauthor } from '../application';
import { assertDirIsRepo, getAuthors, checkboxPrompt } from '../helpers';

const pickAuthorsOptionsSchema = z.object({
  print: z.boolean(),
  sort: z.enum(['commits', 'name', 'email']).optional(),
  order: z.enum(['asc', 'desc']),
});
type Options = z.infer<typeof pickAuthorsOptionsSchema>;

export default async function pickAuthors(options: Options): Promise<void> {
  await assertDirIsRepo();

  const { print, sort, order } = pickAuthorsOptionsSchema.parse(options);

  const authors = await getAuthors({ sort, order });

  const chosenAuthors = await checkboxPrompt(authors, {
    message: 'Which co-authors do you want to select?',
    toChoice: (author) => ({
      title: `${author.name} <${author.email}>`,
      value: author,
    }),
  });

  if (!chosenAuthors?.length) return;

  const formattedAuthors = chosenAuthors.map(toCoauthor).join('\n');

  if (print) {
    console.log(formattedAuthors);
  }

  try {
    await clipboardy.write('\n' + formattedAuthors);
  } catch (err) {
    console.log(err);
  }
}
