import fs from 'fs/promises';
import path from 'path';

import clipboardy from 'clipboardy';
import _ from 'lodash';
import z from 'zod';

import { Author, toCoauthor } from '../application';
import { assertDirIsRepo, getAuthors, checkboxPrompt } from '../helpers';

const pickAuthorsOptionsSchema = z.object({
  print: z.boolean(),
  sort: z.enum(['name', 'email']).optional(),
  order: z.enum(['asc', 'desc']),
});
type Options = z.infer<typeof pickAuthorsOptionsSchema>;

export default async function pickAuthors(options: Options): Promise<void> {
  await assertDirIsRepo();

  const { print, sort, order } = pickAuthorsOptionsSchema.parse(options);

  const recents = await getRecentAuthors();

  const authors = await getAuthors({ sort, order, recents });

  const chosenAuthors = await checkboxPrompt(authors, {
    message: 'Which co-authors do you want to select?',
    toChoice: (author) => ({
      title: `${author.name} <${author.email}>`,
      value: author,
    }),
  });

  if (!chosenAuthors?.length) return;

  const combinedAuthors = await combineRecentAuthors(chosenAuthors, recents);
  await storeRecentAuthors(combinedAuthors);

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

async function getRecentAuthors(): Promise<Author[]> {
  try {
    const filePath = path.join(process.cwd(), '.coauthors');
    const fileData = await fs.readFile(filePath, 'utf-8');

    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
}

async function combineRecentAuthors(
  pickedAuthors: Author[],
  recentAuthors: Author[],
): Promise<Author[]> {
  const combinedAuthors = [...pickedAuthors, ...recentAuthors];

  const unique = _.uniqWith(combinedAuthors, _.isEqual);

  return unique;
}

async function storeRecentAuthors(authors: Author[]): Promise<void> {
  const filePath = path.join(process.cwd(), '.coauthors');
  const data = JSON.stringify(authors, null, 2);

  await fs.writeFile(filePath, data);
}
