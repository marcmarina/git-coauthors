export type Author = {
  name: string;
  email: string;
};

export function toCoauthor(author: Author): string {
  return `Co-authored-by: ${author.name} <${author.email}>`;
}
