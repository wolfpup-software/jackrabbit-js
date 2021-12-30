// brian taylor vann
// samestuff

// samestuff is intended for pojos, arrays, and primitives,
// Restrict usage to tests. Do no use in production.

type SameStuff = (source: unknown, target: unknown) => boolean;
type CompareKeys = (source: Object, target: Object) => boolean;

const compareKeys: CompareKeys = (source, target) => {
  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(source);

  if (sourceKeys.length !== targetKeys.length) {
    return false;
  }

  for (const sourceKey of sourceKeys) {
    const typedSourceKey = sourceKey as keyof typeof source;
    const nextSource = source[typedSourceKey] as unknown;
    const nextTarget = target[typedSourceKey] as unknown;

    if (!samestuff(nextSource, nextTarget)) {
      return false;
    }
  }

  return true;
};

const samestuff: SameStuff = (source, target) => {
  // skip if sutff is just equal
  if (source === target) {
    return source === target;
  }

  if (source instanceof Object && target instanceof Object) {
    if (compareKeys(source, target) && compareKeys(target, source)) {
      return true;
    }
  }

  return false;
};

export { samestuff };
