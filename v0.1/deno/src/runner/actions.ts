// brian taylor vann
// actions

import type {
  Assertions,
  CollectionResult,
  Store,
  UnitTestResult,
} from "../jackrabbit_types.ts";

import {
  CANCEL_RUN,
  CANCELLED,
  END_COLLECTION,
  END_RUN,
  END_UNIT_TEST,
  START_COLLECTION,
  START_RUN,
  START_UNIT_TEST,
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

async function execRun(store: Store, receipt: number) {
  const runResult = store.data.runResults[receipt];
  if (runResult === undefined) {
    return;
  }

  const { indices, runResultID } = runResult;
  const dest = indices[1];
  let target = indices[0];

  store.dispatch({
    kind: START_RUN,
    runResultID,
    startTime: performance.now(),
  });

  while (target < dest) {
    if (runIsCancelled(store, receipt)) {
      return;
    }

    const collection = store.data.collectionResults[target];
    if (collection !== undefined) {
      collection.runTestsAsynchronously
        ? await execCollection(store, receipt, collection)
        : await execCollectionOrdered(store, receipt, collection);
    }

    target += 1;
  }

  const endTime = performance.now();

  if (runIsCancelled(store, receipt)) {
    return;
  }

  store.dispatch({
    kind: END_RUN,
    runResultID,
    endTime,
  });
}

async function execUnitTest(
  store: Store,
  runreceipt: number,
  testResult: UnitTestResult,
  timeoutInterval: number,
) {
  const { unitTestResultID } = testResult;
  const testFunc = store.data.unitTests[unitTestResultID];

  store.dispatch({
    kind: START_UNIT_TEST,
    unitTestResultID,
    startTime: performance.now(),
  });

  // opportunity for index error
  const assertions = (testFunc !== undefined)
    ? await Promise.race([
      createTimeout(timeoutInterval),
      testFunc(),
    ])
    : [];

  const endTime = performance.now();

  if (runIsCancelled(store, runreceipt)) return;

  store.dispatch({
    kind: END_UNIT_TEST,
    unitTestResultID,
    assertions,
    endTime,
  });
}

async function execCollection(
  store: Store,
  runreceipt: number,
  collectionResuilt: CollectionResult,
) {
  const { indices, collectionResultID, timeoutInterval } = collectionResuilt;
  const tests = [];

  let target = indices[0];
  const dest = indices[1];
  while (target <= dest) {
    const testResult = store.data.testResults[target];
    if (testResult !== undefined) {
      tests.push(
        execUnitTest(store, runreceipt, testResult, timeoutInterval),
      );
    }

    target += 1;
  }

  store.dispatch({
    kind: START_COLLECTION,
    collectionResultID,
    startTime: performance.now(),
  });

  await Promise.all(tests);

  const endTime = performance.now();

  if (runIsCancelled(store, runreceipt)) return;

  store.dispatch({
    kind: END_COLLECTION,
    collectionResultID,
    endTime,
  });
}

async function execCollectionOrdered(
  store: Store,
  runreceipt: number,
  collectionResuilt: CollectionResult,
) {
  const { indices, collectionResultID, timeoutInterval } = collectionResuilt;
  const dest = indices[1];
  let target = indices[0];

  store.dispatch({
    kind: START_COLLECTION,
    collectionResultID,
    startTime: performance.now(),
  });

  while (target < dest) {
    if (runIsCancelled(store, runreceipt)) return;

    const testResult = store.data.testResults[target];
    if (testResult !== undefined) {
      await execUnitTest(store, runreceipt, testResult, timeoutInterval);
    }

    target += 1;
  }

  const endTime = performance.now();

  if (runIsCancelled(store, runreceipt)) return;

  store.dispatch({
    kind: END_COLLECTION,
    collectionResultID,
    endTime,
  });
}

function cancelRun(store: Store, receipt: number) {
  store.dispatch({
    kind: CANCEL_RUN,
    runResultID: receipt,
    endTime: performance.now(),
  });
}

function runIsCancelled(store: Store, receipt: number): boolean | undefined {
  const run = store.data.runResults[receipt];
  if (run === undefined) {
    return true;
  }

  return run.status === CANCELLED;
}

export { cancelRun, execRun };
