// brian taylor vann
// samestuff
const samestuff = (source, comparator) => {
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
            const typedSourceKey = sourceKey;
            const nextSource = source[typedSourceKey];
            const nextComparator = comparator[typedSourceKey];
            if (!samestuff(nextSource, nextComparator)) {
                return false;
            }
        }
        // compare comparator to source
        for (const comparatorKey in comparator) {
            // this is not ideal
            const typedComparatorKey = comparatorKey;
            const nextComparator = comparator[typedComparatorKey];
            const nextSource = source[typedComparatorKey];
            if (!samestuff(nextComparator, nextSource)) {
                return false;
            }
        }
    }
    return true;
};
export { samestuff };
