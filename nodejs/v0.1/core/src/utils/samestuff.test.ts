import { samestuff } from "./samestuff.js";

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

  const source: Record<string, string> = { hello: "world" };
  const target: string[] = ["world"];

  if (samestuff(source, target)) {
    assertions.push("[] should not equal {}");
  }

  return assertions;
};

const compareObjects = () => {
  const assertions = [];

  const source: Record<string, string> = {
    hello: "world",
  };

  const target: Record<string, string> = {
    hello: "friend!",
  };

  if (samestuff(source, target)) {
    assertions.push("objects have different values");
  }

  return assertions;
};

const compareNullToObject = () => {
  const assertions = [];

  const source: Record<string, string> = {
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

  const source: Record<string, string> = {
    hello: "world",
  };

  const target: Record<string, string> = {
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

const intentionalFail = () => {
  return ["fail fail fail"];
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
  // intentionalFail,
];

const unitTestSamestuff = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestSamestuff };
