import { describe, expect, it } from 'bun:test';

import { combineUnique, sortBy, unique } from './arrays';

describe('unique', () => {
  it.each<{ input: unknown[]; expected: unknown[] }>([
    { input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
    { input: [1, 2, 3, 4, 5, 1, 2, 3], expected: [1, 2, 3, 4, 5] },
    {
      input: [{ a: 1 }, { a: 2 }, { a: 3 }],
      expected: [{ a: 1 }, { a: 2 }, { a: 3 }],
    },
  ])('returns an array of unique values', ({ input, expected }) => {
    expect(unique(input)).toEqual(expected);
  });
});

describe('combineUnique', () => {
  it.each<{ input: unknown[][]; expected: unknown[] }>([
    {
      input: [
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5],
      ],
      expected: [1, 2, 3, 4, 5],
    },
    {
      input: [
        [{ a: 1 }, { a: 2 }, { a: 3 }],
        [{ a: 1 }, { a: 2 }, { a: 3 }],
      ],
      expected: [{ a: 1 }, { a: 2 }, { a: 3 }],
    },
  ])('returns an array of unique values', ({ input, expected }) => {
    expect(combineUnique(...input)).toEqual(expected);
  });
});

describe('sortBy', () => {
  it("sorts an array of objects by a property's value", () => {
    const input = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
      { name: 'Adrian', age: 35 },
    ];

    const expected = [
      { name: 'Jane', age: 25 },
      { name: 'John', age: 30 },
      { name: 'Adrian', age: 35 },
    ];

    expect(sortBy(input, 'age')).toEqual(expected);
  });
});
