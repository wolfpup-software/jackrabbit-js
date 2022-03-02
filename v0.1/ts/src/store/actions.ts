// brian taylor vann
// actions

import type {
  Collection,
  CollectionResult,
  ResponseRecord,
  StoreAction,
  StoreData,
  RunResult,
  UnitTest,
} from "../jackrabbit_types.ts";

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
      endTime: -1,
      name: test.name,
      startTime: -1,
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
      endTime: -1,
      testTime: -1,
      startTime: -1,
      status: PENDING,
      collectionResultID,
      indices,
      timeoutInterval,
      runTestsAsynchronously,
      title,
    });
  }

  const endIndex = storeData.testResults.length;

  return [startIndex, endIndex];
};


function updateRunResultProperties(storeData: StoreData, runResult: RunResult) {
  // iterate over tests and generate updated properties
  let { status } = runResult;
  let testTime = 0;

  const { indices } = runResult;

  let index = indices[0];
  const target = indices[1];
  while (index < target) {
    const collectionResult = storeData.collectionResults[index];
    if (collectionResult === undefined) {
      status = INDEX_ERROR;
      break;
    }

    if (status === SUBMITTED && collectionResult.status === FAILED) {
      status = FAILED;
    }

    const { startTime, endTime } = collectionResult;
    if (startTime !== -1 && endTime !== -1) {
      testTime += endTime - startTime;
    }

    index += 1;
  }

  // set updated properties
  runResult.status = status === SUBMITTED ? PASSED : status;
  runResult.testTime = testTime;
}


function updateCollectionResult(storeData: StoreData, collectionResult: CollectionResult) {
  // iterate over tests and generate updated properties
  let { status } = collectionResult;
  let testTime = 0;

  const { indices } = collectionResult;

  let index = indices[0];
  const target = indices[1];
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
    if (startTime !== -1 && endTime !== -1) {
      testTime += endTime - startTime;
    }

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
  if (action.kind !== BUILD_RUN) return;

  const { runResultID, run } = action;
  const indices = createCollectionResults(storeData, run);

  storeData.runResults.push({
    status: SUBMITTED,
    endTime: -1,
    startTime: -1,
    testTime: -1,
    runResultID,
    indices,
  });
}

function start_run(storeData: StoreData, action: StoreAction) {
  if (action.kind !== START_RUN) return;

  const { runResultID, startTime } = action;
  const runResults = storeData.runResults[runResultID];
  if (runResults === undefined) {
    return;
  }

  runResults.status = SUBMITTED;
  runResults.startTime = startTime;
}

function end_run(storeData: StoreData, action: StoreAction) {
  if (action.kind !== END_RUN) return;

  const { runResultID } = action;
  const runResult = storeData.runResults[runResultID];
  if (runResult === undefined || runResult.status === CANCELLED) {
    return;
  }

  // set known properties
  runResult.endTime = action.endTime;

  updateRunResultProperties(storeData, runResult)
}

function cancel_run(storeData: StoreData, action: StoreAction) {
  if (action.kind !== CANCEL_RUN) return;

  const { runResultID } = action;
  const runResults = storeData.runResults[runResultID];
  if (runResults === undefined) {
    return;
  }

  runResults.endTime = action.endTime;
  runResults.status = CANCELLED;
}

function start_collection(storeData: StoreData, action: StoreAction) {
  if (action.kind !== START_COLLECTION) return;

  const { collectionResultID } = action;

  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }

  collectionResult.startTime = action.startTime;
  collectionResult.status = SUBMITTED;
}

function end_collection(storeData: StoreData, action: StoreAction) {
  if (action.kind !== END_COLLECTION) return;

  const { collectionResultID } = action;
  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }

  // set known properties
  collectionResult.endTime = action.endTime;

  // update properties
  updateCollectionResult(storeData, collectionResult);
}

function start_unit_test(storeData: StoreData, action: StoreAction) {
  if (action.kind !== START_UNIT_TEST) return;

  const { unitTestResultID, startTime } = action;
  const testResult = storeData.testResults[unitTestResultID];
  if (testResult === undefined) {
    return;
  }

  testResult.status = SUBMITTED;
  testResult.startTime = startTime;
}

function end_unit_test(storeData: StoreData, action: StoreAction) {
  if (action.kind !== END_UNIT_TEST) return;

  const { unitTestResultID, endTime, assertions } = action;
  const testResult = storeData.testResults[unitTestResultID];
  if (testResult === undefined) {
    return;
  }

  testResult.assertions = assertions;
  testResult.status = assertions.length === 0 ? PASSED : FAILED;
  testResult.endTime = endTime;
}

const actions: ResponseRecord = {
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
