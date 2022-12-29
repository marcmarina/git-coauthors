import _ from 'lodash';

/**
 * @param arr Array to sort
 * @param property Property to sort by
 * @param order Order of the sorting
 * @returns The sorted array
 */
export function sortBy<T>(
  arr: T[],
  property: keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] {
  const sorted = _.sortBy(arr, property);

  return order === 'asc' ? sorted : sorted.reverse();
}
