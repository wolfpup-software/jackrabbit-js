const SAFETY = 256;
const samestuff = (source, target, depth = SAFETY) => {
    if (depth < 1) {
        console.warn("samestuff: exceeded maximum depth of recursion");
        return false;
    }
    if (source === target)
        return true;
    if (typeof source !== "object" || typeof target !== "object")
        return source === target;
    if (source === null || target === null)
        return source === target;
    const sourceKeys = Object.keys(source);
    const targetKeys = Object.keys(target);
    if (sourceKeys.length !== targetKeys.length)
        return false;
    for (const sourceKey of sourceKeys) {
        if (!samestuff(source[sourceKey], target[sourceKey], depth - 1)) {
            return false;
        }
    }
    return true;
};
export { samestuff };
