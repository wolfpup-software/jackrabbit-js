// brian taylor vann
// copycopy

// deep clone obejcts and arrays and collections of objects and arrays
// does not support DateTime obejcts

type CopyCopy = <T>(atom: T) => T;

const copycopy: CopyCopy = (atom) => {
  if (atom instanceof Object === false) {
    return atom;
  }

  const entries = Array.isArray(atom)
    ? ([...atom] as typeof atom)
    : { ...atom };

  for (const index in entries) {
    const entry = entries[index];
    if (entries instanceof Object) {
      entries[index] = copycopy(entry);
    }
  }

  return entries;
};

export { copycopy };
