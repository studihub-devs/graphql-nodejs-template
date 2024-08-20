import { isNil } from 'lodash';

export function fillMissingElementByNull<T1, T2>(
  source: ReadonlyArray<T1>,
  target: ReadonlyArray<T2>,
  comparator: (element: T2) => T1,
): Array<T2> {
  const map = new Map(source.map(element => [element, null]));
  target.forEach(element => {
    if (!isNil(comparator(element))) {
      map.set(comparator(element), element);
    }
  });
  return Array.from(map.values());
}

export function sortBasedOnAnotherArray<T1, T2, ID>(
  source: T1[],
  sourceIdGetter: (item: T1) => ID,
  base: T2[],
  baseIdGetter: (item: T2) => ID,
): T1[] {
  if (source.length !== base.length) {
    throw Error('source and base arrays must have same length');
  }
  const idToIndex = new Map();
  base.forEach((item, index) => {
    idToIndex.set(baseIdGetter(item), index);
  });
  const result = new Array<T1>(source.length);
  source.forEach(item => (result[idToIndex.get(sourceIdGetter(item))] = item));
  return result;
}
