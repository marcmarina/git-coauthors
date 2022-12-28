import _ from 'lodash';

export function sortBy<T>(
  arr: T[],
  property: keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] {
  const sorted = _.sortBy(arr, property);

  return order === 'asc' ? sorted : sorted.reverse();
}
