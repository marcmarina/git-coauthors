import z from 'zod';

export const authorSchema = z.object({
  name: z.string(),
  email: z.string(),
});

export type Author = z.infer<typeof authorSchema>;

export function toCoauthor(author: Author): string {
  return `Co-authored-by: ${author.name} <${author.email}>`;
}

export function isAuthor(obj: unknown): obj is Author {
  return authorSchema.safeParse(obj).success;
}
