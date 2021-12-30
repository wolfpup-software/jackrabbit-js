class PubSub {
  stub = 0;
  recycledStubs = [];
  subscriptions = {};
  getStub() {
    const stub = this.recycledStubs.pop();
    if (stub !== undefined) {
      return stub;
    }
    this.stub += 1;
    return this.stub;
  }
  subscribe(callback) {
    const stub = this.getStub();
    this.subscriptions[stub] = callback;
    return stub;
  }
  unsubscribe(stub) {
    if (this.subscriptions[stub] != undefined) {
      this.subscriptions[stub] = undefined;
      this.recycledStubs.push(stub);
    }
  }
  broadcast(params) {
    for (const stubKey in this.subscriptions) {
      const subscription = this.subscriptions[stubKey];
      if (subscription !== undefined) {
        subscription(params);
      }
    }
  }
}
const pubSub = new PubSub();
const subscribe = (resultsCallback) => {
  const stub = pubSub.subscribe(resultsCallback);
  return () => {
    pubSub.unsubscribe(stub);
  };
};
const copycopy = (atom) => {
  if (atom instanceof Object === false) {
    return atom;
  }
  const entries = Array.isArray(atom)
    ? [
      ...atom,
    ]
    : {
      ...atom,
    };
  for (const index in entries) {
    const entry = entries[index];
    if (entries instanceof Object) {
      entries[index] = copycopy(entry);
    }
  }
  return entries;
};
const defaultResultsState = {
  status: "unsubmitted",
};
let resultsState = {
  ...defaultResultsState,
};
const allTestCollectionsHavePassed = (collectionResults) => {
  for (const collection of collectionResults) {
    if (collection.status === "failed") {
      return false;
    }
  }
  return true;
};
const allTestsHavePassed = (testResults) => {
  for (const result of testResults) {
    if (result.status !== "passed") {
      return false;
    }
  }
  return true;
};
const buildResults = ({ testCollection, startTime }) => {
  const nextState = {
    status: "submitted",
    results: [],
    startTime,
  };
  for (const collection of testCollection) {
    const { tests, title } = collection;
    const collectionResults = {
      title,
      status: "unsubmitted",
    };
    const results = [];
    for (const test of tests) {
      const { name } = test;
      results.push({
        status: "unsubmitted",
        name,
      });
    }
    if (nextState.results) {
      nextState.results.push({
        ...collectionResults,
        ...{
          results,
        },
      });
    }
  }
  resultsState = nextState;
};
const startTestCollection = (params) => {
  if (resultsState.results === undefined) {
    return;
  }
  const { startTime, collectionID } = params;
  const collectionResult = resultsState?.results?.[collectionID];
  if (collectionResult) {
    collectionResult.status = "submitted";
    collectionResult.startTime = startTime;
  }
};
const startTest = (params) => {
  if (resultsState.results === undefined) {
    return;
  }
  const { startTime, collectionID, testID } = params;
  const testResult = resultsState?.results?.[collectionID]?.results?.[testID];
  if (testResult) {
    testResult.status = "submitted";
    testResult.startTime = startTime;
  }
};
const cancelRun = (params) => {
  const { endTime } = params;
  resultsState.endTime = endTime;
  resultsState.status = "cancelled";
  const collectionResults = resultsState.results;
  if (collectionResults) {
    for (const collection of collectionResults) {
      if (collection.status === "submitted") {
        collection.status = "cancelled";
      }
      const testResults = collection.results;
      if (testResults) {
        for (const result of testResults) {
          if (result.status === "submitted") {
            result.status = "cancelled";
          }
        }
      }
    }
  }
};
const endTest = (params) => {
  if (resultsState.results === undefined) {
    return;
  }
  const { assertions, endTime, collectionID, testID } = params;
  const testResult = resultsState?.results?.[collectionID]?.results?.[testID];
  if (testResult === undefined) {
    return;
  }
  testResult.status = "failed";
  if (assertions === undefined) {
    testResult.status = "passed";
  }
  if (assertions && assertions.length === 0) {
    testResult.status = "passed";
  }
  testResult.assertions = assertions;
  testResult.endTime = endTime;
};
const endTestCollection = (params) => {
  if (resultsState.results === undefined) {
    return;
  }
  const { endTime, collectionID } = params;
  const collection = resultsState.results[collectionID];
  if (collection === undefined) {
    return;
  }
  collection.endTime = endTime;
  collection.status = "failed";
  const collectionResults = collection.results;
  if (collectionResults && allTestsHavePassed(collectionResults)) {
    collection.status = "passed";
  }
};
const endTestRun = (params) => {
  const { endTime } = params;
  resultsState.endTime = endTime;
  resultsState.status = "failed";
  const results = resultsState.results;
  if (results && allTestCollectionsHavePassed(results)) {
    resultsState.status = "passed";
  }
};
const getResults = () => {
  return copycopy(resultsState);
};
let stub1 = 0;
const getStub = () => {
  return stub1;
};
const updateStub = () => {
  stub1 += 1;
  stub1 %= 4096;
  return stub1;
};
const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
const getTimeoutAssertions = (timeoutInterval) => [
  `timed out at: ${timeoutInterval}`,
];
const createTestTimeout = async (timeoutInterval) => {
  const interval = timeoutInterval ?? 10000;
  await sleep(interval);
  return getTimeoutAssertions(interval);
};
const buildTest = (params) => {
  const { issuedAt, testID, collectionID, timeoutInterval } = params;
  return async () => {
    if (issuedAt < getStub()) {
      return;
    }
    const startTime = performance.now();
    startTest({
      collectionID,
      testID,
      startTime,
    });
    const assertions = await Promise.race([
      params.testFunc(),
      createTestTimeout(timeoutInterval),
    ]);
    if (issuedAt < getStub()) {
      return;
    }
    const endTime = performance.now();
    endTest({
      endTime,
      assertions,
      collectionID,
      testID,
    });
  };
};
const runTestsAllAtOnce = async (
  { startTime, collectionID, tests, timeoutInterval },
) => {
  const builtAsyncTests = [];
  let testID = 0;
  for (const testFunc of tests) {
    builtAsyncTests.push(
      buildTest({
        collectionID,
        issuedAt: startTime,
        testFunc,
        testID,
        timeoutInterval,
      })(),
    );
    testID += 1;
  }
  if (startTime < getStub()) {
    return;
  }
  await Promise.all(builtAsyncTests);
};
const runTestsInOrder = async (
  { startTime, collectionID, tests, timeoutInterval },
) => {
  let testID = 0;
  for (const testFunc of tests) {
    if (startTime < getStub()) {
      return;
    }
    const builtTest = buildTest({
      collectionID,
      issuedAt: startTime,
      testFunc,
      testID,
      timeoutInterval,
    });
    await builtTest();
    testID += 1;
  }
};
const startLtrTestCollectionRun = async (
  { testCollection, startTime, stub },
) => {
  buildResults({
    testCollection,
    startTime,
    stub,
  });
  let collectionID = 0;
  for (const collection of testCollection) {
    if (stub < getStub()) {
      return;
    }
    const { tests, runTestsAsynchronously, timeoutInterval } = collection;
    const runParams = {
      collectionID,
      tests,
      startTime,
      timeoutInterval,
    };
    startTestCollection({
      collectionID,
      startTime,
    });
    if (runTestsAsynchronously) {
      await runTestsAllAtOnce(runParams);
    } else {
      await runTestsInOrder(runParams);
    }
    if (stub < getStub()) {
      return;
    }
    const endTime = performance.now();
    endTestCollection({
      collectionID,
      endTime,
    });
    collectionID += 1;
  }
  if (stub < getStub()) {
    return;
  }
  const endTime = performance.now();
  endTestRun({
    endTime,
  });
};
const runTests = async (params) => {
  const startTime = performance.now();
  const stub = updateStub();
  await startLtrTestCollectionRun({
    ...params,
    ...{
      startTime,
      stub,
    },
  });
  if (stub < getStub()) {
    return;
  }
  return getResults();
};
const compareKeys = (source, target) => {
  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(source);
  if (sourceKeys.length !== targetKeys.length) {
    return false;
  }
  for (const sourceKey of sourceKeys) {
    const typedSourceKey = sourceKey;
    const nextSource = source[typedSourceKey];
    const nextTarget = target[typedSourceKey];
    if (!samestuff(nextSource, nextTarget)) {
      return false;
    }
  }
  return true;
};
const samestuff = (source, target) => {
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
export { cancelRun as cancelRun, runTests as runTests };
export { getResults as getResults, subscribe as subscribe };
export { samestuff as samestuff };
export { copycopy as copycopy };
export { PubSub as PubSub };
