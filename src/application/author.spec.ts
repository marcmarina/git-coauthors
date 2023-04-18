import { Author, isAuthor, toCoauthor } from './author';

const author: Author = {
  name: 'John Doe',
  email: 'john@doe.com',
};

describe('toCoauthor', () => {
  it('should return a coauthor string', () => {
    expect(toCoauthor(author)).toBe('Co-authored-by: John Doe <john@doe.com>');
  });
});

describe('isAuthor', () => {
  it('should return true if the object is an Author', () => {
    expect(isAuthor(author)).toBe(true);
  });

  it('should return false if the object is not an Author', () => {
    expect(
      isAuthor({
        age: 24,
      }),
    ).toBe(false);
  });
});
