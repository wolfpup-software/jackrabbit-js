// brian taylor vann
// copycopy
const copycopy = (atomToCopy) => {
    if (atomToCopy instanceof Object === false) {
        return atomToCopy;
    }
    const entries = Array.isArray(atomToCopy)
        ? [...atomToCopy]
        : Object.assign({}, atomToCopy);
    for (const index in entries) {
        const entry = entries[index];
        if (entries instanceof Object) {
            entries[index] = copycopy(entry);
        }
    }
    return entries;
};
export { copycopy };
