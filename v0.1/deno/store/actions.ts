// brian taylor vann
// actions

import type {
  Collection,
  CollectionResult,
  ReactionRecord,
  RunResult,
  StoreAction,
  StoreData,
  UnitTest,
} from "../utils/jackrabbit_types.ts";

import {
  BUILD_RUN,
  CANCEL_RUN,
  CANCELLED,
  END_COLLECTION,
  END_RUN,
  END_UNIT_TEST,
  FAILED,
  INDEX_ERROR,
  PASSED,
  PENDING,
  START_COLLECTION,
  START_RUN,
  START_UNIT_TEST,
  SUBMITTED,
} from "../utils/constants.ts";

/*
  All store actions and supporting functions must be syncronous
*/

const createUnitTestResults = (storeData: StoreData, tests: UnitTest[]) => {
  const startIndex = storeData.testResults.length;
  for (const test of tests) {
    const unitTestID = storeData.unitTests.length;
    storeData.unitTests.push(test);

    const unitTestResultID = storeData.testResults.length;
    storeData.testResults.push({
      assertions: [],
      endTime: 0,
      name: test.name,
      startTime: 0,
      status: PENDING,
      unitTestResultID,
      unitTestID,
    });
  }

  const endIndex = storeData.testResults.length;

  return [startIndex, endIndex];
};

const createCollectionResults = (
  storeData: StoreData,
  collections: Collection[],
) => {
  const startIndex = storeData.collectionResults.length;

  for (const collection of collections) {
    const collectionResultID = storeData.collectionResults.length;
    const { tests, title, runTestsAsynchronously, timeoutInterval } =
      collection;
    const indices = createUnitTestResults(storeData, tests);

    storeData.collectionResults.push({
      endTime: 0,
      testTime: 0,
      startTime: 0,
      status: PENDING,
      collectionResultID,
      indices,
      timeoutInterval,
      runTestsAsynchronously,
      title,
    });
  }

  const endIndex = storeData.collectionResults.length;

  return [startIndex, endIndex];
};

function updateRunResultProperties(storeData: StoreData, runResult: RunResult) {
  let { indices, status } = runResult;
  const target = indices[1];

  let testTime = 0;
  let index = indices[0];
  while (index < target) {
    const collectionResult = storeData.collectionResults[index];
    if (collectionResult === undefined) {
      status = INDEX_ERROR;
      break;
    }

    if (status === SUBMITTED && collectionResult.status === FAILED) {
      status = FAILED;
    }

    testTime += collectionResult.testTime;

    index += 1;
  }

  // set updated properties
  runResult.status = status === SUBMITTED ? PASSED : status;
  runResult.testTime = testTime;
}

function updateCollectionResult(
  storeData: StoreData,
  collectionResult: CollectionResult,
) {
  let { indices, status } = collectionResult;
  const target = indices[1];

  let testTime = 0;
  let index = indices[0];
  while (index < target) {
    const testResult = storeData.testResults[index];
    if (testResult === undefined) {
      status = INDEX_ERROR;
      break;
    }

    if (status === SUBMITTED && testResult.status === FAILED) {
      status = FAILED;
    }

    const { startTime, endTime } = testResult;
    testTime += endTime - startTime;

    index += 1;
  }

  // set updated properties
  collectionResult.status = status === SUBMITTED ? PASSED : status;
  collectionResult.testTime = testTime;
}

/*
  ACTIONS
*/

// empty action to dispatch test state
function build_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== BUILD_RUN) return;

  const { runResultID, run } = action;
  const indices = createCollectionResults(storeData, run);

  storeData.runResults.push({
    status: SUBMITTED,
    endTime: 0,
    startTime: 0,
    testTime: 0,
    runResultID,
    indices,
  });
}

function start_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== START_RUN) return;

  const { runResultID, startTime } = action;
  const runResults = storeData.runResults[runResultID];
  if (runResults === undefined) {
    return;
  }

  runResults.status = SUBMITTED;
}

function end_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== END_RUN) return;

  const { runResultID } = action;
  const runResult = storeData.runResults[runResultID];
  if (runResult === undefined || runResult.status === CANCELLED) {
    return;
  }

  const { startTime, endTime } = action;
  runResult.startTime = startTime;
  runResult.endTime = endTime;

  updateRunResultProperties(storeData, runResult);
}

function cancel_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== CANCEL_RUN) return;

  const { runResultID } = action;
  const runResults = storeData.runResults[runResultID];
  if (runResults === undefined) {
    return;
  }

  runResults.endTime = action.endTime;
  runResults.status = CANCELLED;
}

function start_collection(storeData: StoreData, action: StoreAction) {
  if (action.type !== START_COLLECTION) return;

  const { collectionResultID } = action;

  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }

  collectionResult.status = SUBMITTED;
}

function end_collection(storeData: StoreData, action: StoreAction) {
  if (action.type !== END_COLLECTION) return;

  const { collectionResultID } = action;
  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }

  const { startTime, endTime } = action;
  collectionResult.startTime = startTime;
  collectionResult.endTime = endTime;

  // update properties
  updateCollectionResult(storeData, collectionResult);
}

function start_unit_test(storeData: StoreData, action: StoreAction) {
  if (action.type !== START_UNIT_TEST) return;

  const { unitTestResultID, startTime } = action;
  const testResult = storeData.testResults[unitTestResultID];
  if (testResult === undefined) {
    return;
  }

  testResult.status = SUBMITTED;
}

function end_unit_test(storeData: StoreData, action: StoreAction) {
  if (action.type !== END_UNIT_TEST) return;

  const { unitTestResultID } = action;
  const testResult = storeData.testResults[unitTestResultID];
  if (testResult === undefined) {
    return;
  }

  const { assertions, startTime, endTime } = action;
  testResult.startTime = startTime;
  testResult.assertions = assertions;
  testResult.endTime = endTime;
  testResult.status = assertions.length === 0 ? PASSED : FAILED;
}

const actions: ReactionRecord<StoreData, StoreAction> = {
  build_run,
  start_run,
  end_run,
  cancel_run,
  start_collection,
  end_collection,
  start_unit_test,
  end_unit_test,
};

export { actions };
