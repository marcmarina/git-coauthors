export type Author = {
  name: string;
  email: string;
  commits: number;
};

export function toCoauthor(author: Author): string {
  return `${author.name} <${author.email}>`;
}
