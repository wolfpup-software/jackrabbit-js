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

function runIsCancelled(store: StoreInterface): boolean {
  return store.data.status === CANCELLED;
}

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
  if (runIsCancelled(store)) return;

  const { testResultID } = testResult;
  const testFunc = store.data.tests[testResultID];
  if (testFunc === undefined) return;

  store.dispatch({
    type: START_TEST,
    testResultID,
    startTime: performance.now(),
  });

  // opportunity for index error
  const assertions = await Promise.race([
    createTimeout(timeoutInterval),
    testFunc(),
  ]);

  if (runIsCancelled(store)) return;

  store.dispatch({
    type: END_TEST,
    testResultID,
    assertions,
    endTime: performance.now(),
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

  store.dispatch({
    type: START_COLLECTION,
    startTime: performance.now(),
    collectionResultID,
  });

  await Promise.all(tests);

  if (runIsCancelled(store)) return;

  store.dispatch({
    type: END_COLLECTION,
    endTime: performance.now(),
    collectionResultID,
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
    startTime: performance.now(),
    collectionResultID,
  });

  let origin = indices[0];
  const target = indices[1];
  while (origin < target) {
    if (runIsCancelled(store)) return;

    const testResult = store.data.testResults[origin];
    if (testResult !== undefined) {
      await execTest(store, testResult, timeoutInterval);
    }

    origin += 1;
  }

  const endTime = performance.now();

  if (runIsCancelled(store)) return;

  store.dispatch({
    type: END_COLLECTION,
    endTime: performance.now(),
    collectionResultID,
  });
}

export { cancelRun, execRun };

