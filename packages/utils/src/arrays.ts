import _ from 'lodash';

/**
 * @param arr Array to sort
 * @param property Property to sort by
 * @param order Order of the sorting
 * @returns The sorted array
 */
export function sortBy<T, K extends keyof T>(
  arr: T[],
  property: K,
  order: 'asc' | 'desc' = 'asc',
): T[] {
  const sorted = _.sortBy(arr, property);

  return order === 'asc' ? sorted : sorted.reverse();
}

export function combineUnique<T>(...arrays: T[][]): T[] {
  return unique(_.flatten(arrays));
}

export function unique<T>(array: T[]): T[] {
  return _.uniqWith(array, _.isEqual);
}
