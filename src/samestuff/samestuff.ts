// brian taylor vann
// samestuff

// samestuff is intended for pojos, arrays, and primitives,
// Restrict usage to tests. Do no use in production.

type SameStuff = (source: unknown, comparator: unknown) => boolean;

const samestuff: SameStuff = (source, comparator) => {
  if (source === null || comparator === null) {
    return source === comparator;
  }

  const isSourceObject = source instanceof Object;
  const isComparatorObject = comparator instanceof Object;
  if (!isSourceObject || !isComparatorObject) {
    return source === comparator;
  }

  const isSourceFunc = source instanceof Function;
  const isComparatorFunc = comparator instanceof Function;
  if (isSourceFunc || isComparatorFunc) {
    return source === comparator;
  }

  const isSourceArray = source instanceof Array;
  const isComparatorArray = comparator instanceof Array;
  if (isSourceArray !== isComparatorArray) {
    return source === comparator;
  }

  // compare source to comparator
  if (source instanceof Object && comparator instanceof Object) {
    for (const sourceKey in source) {
      // this is not ideal
      const typedSourceKey = sourceKey as keyof typeof source;
      const nextSource = source[typedSourceKey] as unknown;
      const nextComparator = comparator[typedSourceKey] as unknown;

      if (!samestuff(nextSource, nextComparator)) {
        return false;
      }
    }

    // compare comparator to source
    for (const comparatorKey in comparator) {
      // this is not ideal
      const typedComparatorKey = comparatorKey as keyof typeof comparator;
      const nextComparator = comparator[typedComparatorKey] as unknown;
      const nextSource = source[typedComparatorKey] as unknown;

      if (!samestuff(nextComparator, nextSource)) {
        return false;
      }
    }
  }

  return true;
};

export { samestuff };
