// brian taylor vann
// samestuff

// samestuff is intended for pojos, arrays, and primitives,
// Limit usage to tests. Do no use in production.

type SameStuff = (source: unknown, target: unknown, depth?: number) => boolean;
type CompareKeys = (
  source: Object,
  target: Object,
  depth: number,
) => boolean;

const SAFETY = 256;

const samestuff: SameStuff = (source, target, safety = SAFETY) => {
  if (source === target) {
    return true;
  }

  if (typeof source !== "object" || typeof target !== "object") {
    return source === target;
  }

  if (source === null || target === null) {
    return source === target;
  }

  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);
  if (sourceKeys.length !== targetKeys.length) return false;

  for (const sourceKey of sourceKeys) {
    if (
      !samestuff(
        source[sourceKey as keyof typeof source],
        target[sourceKey as keyof typeof target],
        safety - 1,
      )
    ) {
      return false;
    }
  }

  return true;
};

export { samestuff };
