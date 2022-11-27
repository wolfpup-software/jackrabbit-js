// brian taylor vann
// actions

import type {
  Assertions,
  CollectionResult,
  StoreInterface,
  TestResult,
} from "../utils/jackrabbit_types.ts";

import {
  CANCEL_RUN,
  CANCELLED,
  END_COLLECTION,
  END_RUN,
  END_TEST,
  START_COLLECTION,
  START_RUN,
  START_TEST,
} from "../utils/constants.ts";

/*
  All asyncronous logic resides here.

  Syncronous calls are made to the store from the asyncronus logic below.
*/

type CreateTimeout = (requestedInterval: number) => Promise<Assertions>;
type Sleep = (time: number) => Promise<void>;

const TIMOUT_INTERVAL = 10000;

const sleep: Sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const createTimeout: CreateTimeout = async (timeoutInterval: number) => {
  const interval = timeoutInterval === -1 ? TIMOUT_INTERVAL : timeoutInterval;
  await sleep(interval);

  return [`timed out at: ${timeoutInterval}`];
};

async function execRun(store: StoreInterface) {
  const startTime = performance.now();

  store.dispatch({
    type: START_RUN,
    startTime,
  });

  for (const collectionResult of store.data.collectionResults) {
    if (runIsCancelled(store)) {
      return;
    }
    collectionResult.runTestsAsynchronously
      ? await execCollection(store, collectionResult)
      : await execCollectionOrdered(store, collectionResult);
  }

  const endTime = performance.now();

  if (runIsCancelled(store)) {
    return;
  }

  store.dispatch({
    type: END_RUN,
    endTime,
  });
}

function cancelRun(store: StoreInterface) {
  store.dispatch({
    type: CANCEL_RUN,
    endTime: performance.now(),
  });
}

async function execTest(
  store: StoreInterface,
  testResult: TestResult,
  timeoutInterval: number,
) {
  const { testResultID } = testResult;
  const testFunc = store.data.tests[testResultID];

  const startTime = performance.now();
  store.dispatch({
    type: START_TEST,
    testResultID,
    startTime,
  });

  // opportunity for index error
  const assertions = (testFunc !== undefined)
    ? await Promise.race([
      createTimeout(timeoutInterval),
      testFunc(),
    ])
    : [];

  const endTime = performance.now();

  if (runIsCancelled(store)) return;

  store.dispatch({
    type: END_TEST,
    testResultID,
    assertions,
    endTime,
  });
}

async function execCollection(
  store: StoreInterface,
  collectionResult: CollectionResult,
) {
  if (runIsCancelled(store)) return;

  const { indices, collectionResultID, timeoutInterval } = collectionResult;
  const tests = [];

  let target = indices[0];
  const dest = indices[1];
  while (target <= dest) {
    const testResult = store.data.testResults[target];
    if (testResult !== undefined) {
      tests.push(
        execTest(store, testResult, timeoutInterval),
      );
    }

    target += 1;
  }

  const startTime = performance.now();

  store.dispatch({
    type: START_COLLECTION,
    collectionResultID,
    startTime,
  });

  await Promise.all(tests);

  const endTime = performance.now();

  if (runIsCancelled(store)) return;

  store.dispatch({
    type: END_COLLECTION,
    collectionResultID,
    endTime,
  });
}

async function execCollectionOrdered(
  store: StoreInterface,
  collectionResult: CollectionResult,
) {
  if (runIsCancelled(store)) return;

  const { indices, collectionResultID, timeoutInterval } = collectionResult;

  const startTime = performance.now();

  store.dispatch({
    type: START_COLLECTION,
    collectionResultID,
    startTime,
  });

  const dest = indices[1];
  let target = indices[0];
  while (target < dest) {
    if (runIsCancelled(store)) return;

    const testResult = store.data.testResults[target];
    if (testResult !== undefined) {
      await execTest(store, testResult, timeoutInterval);
    }

    target += 1;
  }

  const endTime = performance.now();

  if (runIsCancelled(store)) return;

  store.dispatch({
    type: END_COLLECTION,
    collectionResultID,
    endTime,
  });
}

function runIsCancelled(store: StoreInterface): boolean {
  return store.data.status === CANCELLED;
}

export { cancelRun, execRun };
