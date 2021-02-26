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

// brian taylor vann
const title = "samestuff";
const runTestsAsynchronously = true;
const compareDifferentPrimitives = () => {
    const assertions = [];
    const source = "a";
    const target = 1;
    if (samestuff(source, target)) {
        assertions.push('"a" not equal to 1');
    }
    return assertions;
};
const compareEqualPrimitives = () => {
    const assertions = [];
    const source = "a";
    const target = "a";
    if (!samestuff(source, target)) {
        assertions.push('"a" should equal "a"');
    }
    return assertions;
};
const compareArrayAndObject = () => {
    const assertions = [];
    const source = { hello: "world" };
    const target = ["world"];
    if (samestuff(source, target)) {
        assertions.push("[] should not equal {}");
    }
    return assertions;
};
const compareObjects = () => {
    const assertions = [];
    const source = {
        hello: "world",
    };
    const target = {
        hello: "friend!",
    };
    if (samestuff(source, target)) {
        assertions.push("objects have different values");
    }
    return assertions;
};
const compareNullToObject = () => {
    const assertions = [];
    const source = {
        hello: "world",
    };
    const target = null;
    if (samestuff(source, target)) {
        assertions.push("null is not equal to an object");
    }
    return assertions;
};
const compareSimilarObjects = () => {
    const assertions = [];
    const source = {
        hello: "world",
    };
    const target = {
        hello: "world",
    };
    if (!samestuff(source, target)) {
        assertions.push("objects have equal values");
    }
    return assertions;
};
const compareNestedObjects = () => {
    const assertions = [];
    const source = {
        hello: "world",
        goodbye: {
            captain: "kitty",
        },
    };
    const target = {
        hello: "world",
        goodbye: {
            captain: "0w0",
        },
    };
    if (samestuff(source, target)) {
        assertions.push("objects have different nested values");
    }
    return assertions;
};
const compareNestedEqualObjects = () => {
    const assertions = [];
    const source = {
        hello: "world",
        goodbye: {
            captain: "0w0",
        },
    };
    const target = {
        hello: "world",
        goodbye: {
            captain: "0w0",
        },
    };
    if (!samestuff(source, target)) {
        assertions.push("objects have equal nested values");
    }
    return assertions;
};
const tests = [
    compareDifferentPrimitives,
    compareEqualPrimitives,
    compareArrayAndObject,
    compareObjects,
    compareNullToObject,
    compareSimilarObjects,
    compareNestedObjects,
    compareNestedEqualObjects,
];
const unitTestSamestuff = {
    title,
    tests,
    runTestsAsynchronously,
};

// brian taylor vann
const tests$1 = [unitTestSamestuff];

export { tests$1 as tests };
