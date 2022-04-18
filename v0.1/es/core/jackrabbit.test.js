const samestuff = (source, target, safety = 256) => {
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
    if (!samestuff(source[sourceKey], target[sourceKey], safety - 1)) {
      return false;
    }
  }
  return true;
};
const title = "samestuff";
const compareDifferentPrimitives = () => {
  const assertions = [];
  const source = "a";
  if (samestuff(source, 1)) {
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
  const source = {
    hello: "world",
  };
  const target = [
    "world",
  ];
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
  if (samestuff(source, null)) {
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
  runTestsAsynchronously: true,
};
const tests1 = [
  unitTestSamestuff,
];
export { tests1 as tests };
