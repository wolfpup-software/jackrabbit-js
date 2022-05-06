// brian taylor vann
// actions

import type {
  CollectionResult,
  Reactions,
  StoreAction,
  StoreData,
} from "../utils/jackrabbit_types.ts";

import {
  CANCEL_RUN,
  CANCELLED,
  END_COLLECTION,
  END_RUN,
  END_TEST,
  FAILED,
  PASSED,
  START_COLLECTION,
  START_RUN,
  START_TEST,
  UNSUBMITTED,
} from "../utils/constants.ts";

/*
  All store actions and supporting functions must be syncronous
*/

function updateResultProperties(storeData: StoreData) {
  const { result } = storeData;
  let { status } = storeData.result;
  let testTime = 0;

  for (const collectionResult of storeData.collectionResults) {
    if (status === UNSUBMITTED && collectionResult.status === FAILED) {
      status = FAILED;
    }

    testTime += collectionResult.testTime;
  }

  // set updated properties
  result.status = status === UNSUBMITTED ? PASSED : status;
  result.testTime = testTime;
}

function updateCollectionResult(
  storeData: StoreData,
  collectionResult: CollectionResult,
) {
  let testTime = 0;
  let { indices, status } = collectionResult;

  const target = indices[1];
  let index = indices[0];
  while (index < target) {
    const { result } = storeData;

    if (status === UNSUBMITTED && result.status === FAILED) {
      status = FAILED;
    }

    const { startTime, endTime } = result;
    testTime += endTime - startTime;

    index += 1;
  }

  // set updated properties
  collectionResult.status = status === UNSUBMITTED ? PASSED : status;
  collectionResult.testTime = testTime;
}

/*
  ACTIONS
*/

function start_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== START_RUN) return;

  const { startTime } = action;
  const { result } = storeData;

  result.status = UNSUBMITTED;
  result.startTime = startTime;
}

function end_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== END_RUN) return;

  const { result } = storeData;
  if (result.status === CANCELLED) return;

  const { endTime } = action;
  result.endTime = endTime;

  updateResultProperties(storeData);
}

function cancel_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== CANCEL_RUN) return;

  const { result } = storeData;

  result.status = CANCELLED;
  result.endTime = action.endTime;
}

function start_collection(storeData: StoreData, action: StoreAction) {
  if (action.type !== START_COLLECTION) return;

  const { collectionResultID, startTime } = action;

  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }

  collectionResult.status = UNSUBMITTED;
  collectionResult.startTime = startTime;
}

function end_collection(storeData: StoreData, action: StoreAction) {
  if (action.type !== END_COLLECTION) return;

  const { collectionResultID } = action;
  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }

  const { endTime } = action;
  collectionResult.endTime = endTime;

  // update properties
  updateCollectionResult(storeData, collectionResult);
}

function start_test(storeData: StoreData, action: StoreAction) {
  if (action.type !== START_TEST) return;

  const { testResultID, startTime } = action;
  const testResult = storeData.testResults[testResultID];
  if (testResult === undefined) {
    return;
  }

  testResult.status = UNSUBMITTED;
  testResult.startTime = startTime;
}

function end_test(storeData: StoreData, action: StoreAction) {
  if (action.type !== END_TEST) return;

  const { testResultID } = action;
  const testResult = storeData.testResults[testResultID];
  if (testResult === undefined) {
    return;
  }

  const { assertions, endTime } = action;
  testResult.assertions = assertions;
  testResult.endTime = endTime;
  testResult.status = assertions.length === 0 ? PASSED : FAILED;
}

const reactions: Reactions = {
  start_run,
  end_run,
  cancel_run,
  start_collection,
  end_collection,
  start_test,
  end_test,
};

export { reactions };
