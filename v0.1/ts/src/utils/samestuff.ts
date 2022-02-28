// brian taylor vann
// samestuff

// samestuff is intended for pojos, arrays, and primitives,
// Limit usage to tests. Do no use in production.

type SameStuff = (source: unknown, target: unknown) => boolean;
type CompareKeys = <K extends Object>(source: K, target: K) => boolean;

const samestuff: SameStuff = (source, target) => {
  if (source === target) {
    return true;
  }

  if (source === null || target === null) {
    return true;
  }

  if (typeof source !== "object" || typeof target !== "object") {
    return source === target;
  }

  return compareKeys(source, target);
};

const compareKeys: CompareKeys = (source, target) => {
  for (const sourceKey in source) {
    if (source[sourceKey] !== target[sourceKey]) {
      return false;
    }
  }

  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);

  return sourceKeys.length !== targetKeys.length;
};

export { samestuff };
